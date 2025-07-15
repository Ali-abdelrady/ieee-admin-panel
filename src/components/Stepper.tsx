'use client';

import React, {useEffect, useState} from 'react';
import {useForm, useWatch, Controller} from 'react-hook-form';
import {Button} from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from '@/components/ui/select';
import {Popover, PopoverTrigger, PopoverContent} from '@/components/ui/popover'
import {Calendar} from '@/components/ui/calendar'
import {Badge, CalendarIcon, X} from 'lucide-react'
import {format} from 'date-fns'
import {cn} from '@/lib/utils'
import {toast} from 'sonner';
import {useGetCertificateTypesQuery} from '@/services/Api/inspection/certificateTypes';
import {useGetQuestionsByCertificateTypeIdQuery} from '@/services/Api/inspection/questions';
import {useGetEquipmentsQuery} from "@/services/Api/equipments";
import {FormFieldType} from "@/types";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "./ui/command";
import {
    useAddSingleinspectionCertificatesMutation,
    useGetinspectionCertificateByIdQuery
} from "@/services/Api/inspection/inspectionCertificate";
import {useParams} from "next/navigation";
import {useDispatch} from "react-redux";
import {triggerCloseAll} from "@/services/store/features/dialogSlice";

type FormValues = {
    certificateType: string;
    equipments: string[];
    date_of_examination: string;
    expire_data: string;
    id: string;
};

export default function CertificateWizard({operation = "add", id}
) {


    console.log(id, "theid")
    const [step, setStep] = useState(0);
    const totalSteps = 2;
    const params = useParams();
    const group_id = params?.id;
    const isEdit = operation === 'edit';
    const {data: editRes} = useGetinspectionCertificateByIdQuery(id, {skip: !isEdit});

    const allEditData = editRes?.data || {};
    const editData = editRes?.data?.certificate || {};

    console.log(editData, "editDataaaaaaaaaaa")
    const [defaultValues, setDefaultValues] = useState({
        certificateType: '',
        equipments: [],
        date_of_examination: '',
        expire_data: '',
        ...editData
    })
    const dispatch = useDispatch();
    const [addSingleCertificate] = useAddSingleinspectionCertificatesMutation()
    // single form context for both steps
    const form = useForm<FormValues>({
        defaultValues: defaultValues
    });
    const {control, handleSubmit, watch, reset, setValue} = form;

    // watch certificateType
    const certificateType = watch('certificateType');

    // fetch certificate types for step 1
    const {data: certTypesData} = useGetCertificateTypesQuery();
    const {data: equipments} = useGetEquipmentsQuery()
    const certificateTypeOptions = certTypesData?.data.map((ct) => ({
        label: ct.name,
        value: ct.id.toString(),
    })) || [];
    const equpmentsOptions = equipments?.data.map((equ) => ({
        label: equ.equipment_name,
        value: equ.id.toString(),
    }))

    // step‑2: fetch questions only when we enter step 2 and have a type
    const {data: questionsData, isFetching} = useGetQuestionsByCertificateTypeIdQuery(
        certificateType ?? 1,
        {skip: step !== 1 || !certificateType}
    );


    // when questions arrive, register their default values
    // useEffect(() => {
    //     if (isEdit && Object.keys(editData).length) {
    //         reset({
    //             certificateType: editData.certificateType || "",
    //             equipments: editData.equipments || [],
    //             date_of_examination: editData.date_of_examination || "",
    //             expire_data: editData.expire_data || "",
    //             // spread in any question‑answers too:
    //             ...editData,
    //         });
    //     }
    // }, [isEdit, editData, reset]);
    useEffect(() => {
        if (step === 1 && questionsData?.data) {
            questionsData.data.forEach((q) => {
                // only overwrite if RHF has no value yet
                console.log(q, editData, "ali ali ali")
                const current = watch(q.question_variable);
                if (current === undefined) {
                    setValue(q.question_variable, editData[q.question_variable] ?? "");
                }
            });
        }
    }, [step, questionsData, watch, setValue, editData]);
    useEffect(() => {

        if (step === 1 && questionsData?.data) {
            questionsData.data.forEach((q) => {
                // initialize each question field in RHF
                setValue(q.question_variable, '');
            });
        }
    }, [step, questionsData, setValue]);
    // useEffect(() => {
    //     if (Object.keys(editData).length) {
    //         reset({
    //             certificateType: editData.certificateType || '',
    //             equipments: editData.equipments || [],
    //             date_of_examination: editData.date_of_examination || '',
    //             expire_data: editData.expire_data || '',
    //             // note: question‑variable keys copied below
    //             ...editData,
    //         });
    //     }
    // }, [editData, reset]);


    function onNext() {
        if (step === 0 && !certificateType) {
            toast.error('Please select a certificate type.');
            return
        }
        setStep(1);
    }

    function onBack() {
        setStep(0);
    }

    // console.log(questionsData, 'questionsData');

    async function onSubmit(values: FormValues) {

        const payload = Object.fromEntries(
            Object.entries(values).map(([key, val]) => {
                // if it's a checkbox field (boolean), transform it:
                if (typeof val === 'boolean') {
                    return [key, val ? 'correct' : ''];
                }
                // otherwise leave as-is:
                return [key, val];
            })
        );
        try {
            // wait for the promise to resolve
            await addSingleCertificate({...payload, group_id}).unwrap();
            console.log('FINAL PAYLOAD', values);
            toast.success('Submitted!');
            dispatch(triggerCloseAll());

        } catch (err) {
            console.error('Submission failed', err);
            toast.error('Submission failed. Please try again.');
        }


        // reset();

    }

    console.log(step, "step")

    const fields: FormFieldType[] = [
        {
            name: "certificateType",
            label: "Certificate Type",
            type: "select",
            options: certificateTypeOptions,
        },
        {
            name: "equipments",
            label: "Equipments",
            type: "multiSelect",
            options: equpmentsOptions,
        },
        {
            name: "date_of_examination",
            label: "Date of Examination",
            type: "date",
        },
        {
            name: "expire_data",
            label: "Expire Data",
            type: "date",
        }
    ]
    return (
        <Card className=" h-full">
            <CardHeader>
                <CardTitle>Inspection Wizard</CardTitle>
                <CardDescription>
                    Step {step + 1} of {totalSteps}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">

                        {step === 0 &&
                            fields.map(fieldItem => (
                                <FormField
                                    key={fieldItem.name}
                                    control={control}
                                    name={fieldItem.name as any}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>{fieldItem.label}</FormLabel>

                                            {/* multiSelect */}
                                            {fieldItem.type === "multiSelect" && (
                                                <FormControl>
                                                    <div className="space-y-2">
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    className={cn(
                                                                        "w-full justify-between",
                                                                        !(field.value as any[])?.length &&
                                                                        "text-muted-foreground",
                                                                        operation === "preview" &&
                                                                        "cursor-not-allowed opacity-50"
                                                                    )}
                                                                    disabled={operation === "preview"}
                                                                >
                                                                    {(field.value as any[])?.length
                                                                        ? (field.value as any[]).length ===
                                                                        fieldItem.options?.length
                                                                            ? "All selected"
                                                                            : (field.value as any[]).length === 1
                                                                                ? fieldItem.options?.find(
                                                                                    option =>
                                                                                        option.value ===
                                                                                        (field.value as any[])[0]
                                                                                )?.label
                                                                                : `${(field.value as any[]).length} selected`
                                                                        : `Select ${fieldItem.label}`}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            {operation !== "preview" && (
                                                                <PopoverContent className="w-full p-0">
                                                                    <Command>
                                                                        <CommandInput
                                                                            placeholder={`Search ${fieldItem.label}...`}
                                                                            className="h-9"
                                                                        />
                                                                        <div className="flex space-x-2 p-1">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-8 px-2"
                                                                                onClick={() => {
                                                                                    field.onChange(
                                                                                        fieldItem.options?.map(
                                                                                            option => option.value
                                                                                        ) || []
                                                                                    );
                                                                                }}
                                                                            >
                                                                                Select All
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-8 px-2"
                                                                                onClick={() => {
                                                                                    field.onChange([]);
                                                                                }}
                                                                            >
                                                                                Deselect All
                                                                            </Button>
                                                                        </div>
                                                                        <CommandEmpty>
                                                                            No {fieldItem.label} found.
                                                                        </CommandEmpty>
                                                                        <CommandGroup
                                                                            className="max-h-64 overflow-y-auto">
                                                                            {fieldItem.options?.map(option => {
                                                                                const isSelected =
                                                                                    (field.value as any[])?.includes(
                                                                                        option.value
                                                                                    );
                                                                                return (
                                                                                    <CommandItem
                                                                                        key={option.value}
                                                                                        onSelect={() => {
                                                                                            const current =
                                                                                                (field.value as any[]) || [];
                                                                                            if (isSelected) {
                                                                                                field.onChange(
                                                                                                    current.filter(
                                                                                                        val => val !== option.value
                                                                                                    )
                                                                                                );
                                                                                            } else {
                                                                                                field.onChange([
                                                                                                    ...current,
                                                                                                    option.value,
                                                                                                ]);
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        <div
                                                                                            className="flex items-center space-x-2">
                                                                                            <Checkbox
                                                                                                checked={isSelected}/>
                                                                                            <span>{option.label}</span>
                                                                                        </div>
                                                                                    </CommandItem>
                                                                                );
                                                                            })}
                                                                        </CommandGroup>
                                                                    </Command>
                                                                </PopoverContent>
                                                            )}
                                                        </Popover>
                                                        {(field.value as any[])?.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-2">

                                                                {(field.value as any[]).map(value => {

                                                                    const opt = fieldItem.options?.find(
                                                                        o => o.value == value
                                                                    );
                                                                    // console.log(opt.label, "dsd")
                                                                    return (

                                                                        <div key={value}
                                                                             className="flex items-center space-x-2 bg-gray-100 px-2 py-1 rounded-md">
                                                                            {opt?.label}
                                                                            {operation !== "preview" && (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        field.onChange(
                                                                                            (field.value as any[]).filter(
                                                                                                val => val !== value
                                                                                            )
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <X className="ml-2 h-3 w-3"/>
                                                                                </button>
                                                                            )}
                                                                        </div>

                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </FormControl>
                                            )}

                                            {/* date */}
                                            {fieldItem.type === "date" && (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground",
                                                                    operation === "preview" &&
                                                                    "cursor-not-allowed opacity-50"
                                                                )}
                                                                type="button"
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "yyyy-MM-dd")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon
                                                                    className="ml-auto h-4 w-4 opacity-50"/>
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    {operation !== "preview" && (
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                // onSelect={field.onChange}
                                                                onSelect={(date) => {
                                                                    if (date) {
                                                                        const onlyDate = format(date, 'yyyy-MM-dd');
                                                                        field.onChange(onlyDate);
                                                                    }
                                                                }}
                                                                disabled={date => date < new Date("1900-01-01")}
                                                                autoFocus
                                                            />
                                                        </PopoverContent>
                                                    )}
                                                </Popover>
                                            )}

                                            {/* checkbox */}
                                            {fieldItem.type === "checkbox" && (
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value as boolean}
                                                        onCheckedChange={field.onChange}
                                                        disabled={operation === "preview"}
                                                    />
                                                </FormControl>
                                            )}

                                            {/* select */}
                                            {fieldItem.type === "select" && (
                                                <FormControl>
                                                    <Select
                                                        value={field.value?.toString()}
                                                        onValueChange={field.onChange}
                                                        disabled={operation === "preview"}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={`Select ${fieldItem.label}`}>
                                                                {fieldItem.options?.find(
                                                                    option =>
                                                                        option.value.toString() ===
                                                                        field.value?.toString()
                                                                )?.label ?? `Select ${fieldItem.label}`}
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {fieldItem.options?.map(option => (
                                                                <SelectItem
                                                                    key={option.value}
                                                                    value={option.value.toString()}
                                                                >
                                                                    {option.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            )}

                                        </FormItem>
                                    )}
                                />
                            ))
                        }


                        {step === 1 && (
                            <>
                                {isFetching && <p>Loading questions…</p>}
                                {!isFetching &&
                                    questionsData?.data.map((q) => (
                                        <FormField
                                            key={q.question_variable}
                                            control={control}
                                            name={q.question_variable as any}
                                            render={({field}) => {
                                                // console.log(q, 'q');
                                                // let type = JSON.parse(q.question_type) as any;
                                                let type: any;
                                                try {
                                                    if (JSON.parse(q.question_type))
                                                        type = JSON.parse(q.question_type);
                                                    // console.log(type, "type.type")
                                                } catch (e) {

                                                    // console.log(type, q.question_type, "type")
                                                    // console.error("Invalid question_type JSON:", q.question_type);
                                                    type = {type: q.question_type}; // fallback
                                                }
                                                switch (type.type as any) {
                                                    case 'select':
                                                        return (
                                                            <FormItem>
                                                                <FormLabel>{q.question_text}</FormLabel>
                                                                <FormControl>
                                                                    <Select
                                                                        value={field.value}
                                                                        onValueChange={field.onChange}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select…"/>
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {type.options?.map((opt) => (
                                                                                <SelectItem
                                                                                    key={opt}
                                                                                    value={String(opt)}
                                                                                >
                                                                                    {opt}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        );

                                                    case 'checkbox':
                                                        return (
                                                            <FormItem className="flex items-center space-x-3">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value}
                                                                        onCheckedChange={field.onChange}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="m-0">
                                                                    {q.question_text}
                                                                </FormLabel>
                                                            </FormItem>
                                                        );

                                                    case 'date':
                                                        return (
                                                            <FormItem>
                                                                <FormLabel>{q.question_text}</FormLabel>
                                                                <FormControl>
                                                                    <Popover>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                className={cn(
                                                                                    "w-full pl-3 text-left font-normal",
                                                                                    !field.value && "text-muted-foreground"
                                                                                )}
                                                                                type="button"
                                                                            >
                                                                                {field.value
                                                                                    ? format(new Date(field.value), "yyyy-MM-dd")
                                                                                    : <span>Pick a date</span>
                                                                                }
                                                                                <CalendarIcon
                                                                                    className="ml-auto h-4 w-4 opacity-50"/>
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto p-0"
                                                                                        align="start">
                                                                            <Calendar
                                                                                mode="single"
                                                                                selected={field.value ? new Date(field.value) : undefined}
                                                                                // onSelect={(date) => field.onChange(date)}
                                                                                onSelect={(date) => {
                                                                                    if (date) {
                                                                                        const onlyDate = format(date, 'yyyy-MM-dd');
                                                                                        field.onChange(onlyDate);
                                                                                    }
                                                                                }}
                                                                                disabled={(date) => date < new Date("1900-01-01")}
                                                                                autoFocus
                                                                            />
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )

                                                    default:
                                                        return (
                                                            <FormItem>
                                                                <FormLabel>{q.question_text}</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        placeholder={q.question_text}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        );
                                                }
                                            }}
                                        />
                                    ))}
                            </>
                        )}


                        <div className="flex justify-between ">
                            <Button variant="outline" type="button" onClick={onBack} disabled={step === 0}>
                                Back
                            </Button>

                            {step < totalSteps - 1 ? (
                                <Button type="button" onClick={handleSubmit(onNext)}>Next</Button>
                            ) : (
                                <Button type="submit">Submit</Button>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
