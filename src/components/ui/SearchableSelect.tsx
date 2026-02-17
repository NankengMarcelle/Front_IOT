"use client";

import { useState, useMemo } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { Check, ChevronDown, Search, X } from "lucide-react";

interface Option<T> {
    id: T;
    label: string;
    [key: string]: any;
}

interface SearchableSelectProps<T> {
    options: Option<T>[];
    value: T;
    onChange: (value: T) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    error?: string;
    className?: string;
}

export default function SearchableSelect<T extends string | number | undefined | null>({
    options,
    value,
    onChange,
    placeholder = "Sélectionner...",
    searchPlaceholder = "Rechercher...",
    disabled = false,
    error,
    className = "",
}: SearchableSelectProps<T>) {
    const [query, setQuery] = useState("");

    const selectedOption = useMemo(
        () => options.find((opt) => String(opt.id) === String(value)),
        [options, value]
    );

    const filteredOptions = useMemo(() => {
        if (query === "") return options;
        return options.filter((opt) =>
            opt.label.toLowerCase().includes(query.toLowerCase())
        );
    }, [options, query]);

    return (
        <div className={`relative w-full ${className}`}>
            <Combobox value={value} onChange={onChange as (val: T | null) => void} disabled={disabled}>
                <div className="relative">
                    <div
                        className={`relative w-full bg-slate-50 border-2 rounded-[24px] transition-all cursor-pointer flex items-center overflow-hidden ${error
                            ? "border-rose-200 ring-rose-50/50"
                            : "border-slate-100 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50/50"
                            } ${disabled ? "opacity-60 cursor-not-allowed" : "hover:border-slate-300"}`}
                    >
                        <Combobox.Button className="w-full text-left flex items-center justify-between px-6 py-5 outline-none">
                            <span className={`block truncate text-lg font-bold ${selectedOption ? "text-slate-800" : "text-slate-400"}`}>
                                {selectedOption ? selectedOption.label : placeholder}
                            </span>
                            <ChevronDown
                                className={`w-5 h-5 text-slate-300 transition-transform duration-200 ${disabled ? "" : "group-hover:text-emerald-500"
                                    }`}
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>

                    <Transition
                        as="div"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}
                        className="absolute z-[100] mt-2 w-full bg-white rounded-[24px] shadow-2xl border border-emerald-100 overflow-hidden"
                    >
                        <div className="p-3 border-b border-slate-50">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Combobox.Input
                                    className="w-full bg-slate-50 border-none rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-300"
                                    displayValue={(v: any) => ""}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder={searchPlaceholder}
                                />
                            </div>
                        </div>

                        <Combobox.Options className="max-h-60 overflow-auto py-2 outline-none" modal={false}>
                            {filteredOptions.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none py-4 px-6 text-slate-500 text-center italic text-sm">
                                    Aucun résultat trouvé.
                                </div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <Combobox.Option
                                        key={option.id}
                                        className={({ active, selected }) =>
                                            `relative cursor-pointer select-none py-4 px-6 transition-colors ${active ? "bg-emerald-50 text-emerald-700" : "text-slate-700"
                                            } ${selected ? "bg-emerald-100/50 font-black text-emerald-800" : "font-bold"}`
                                        }
                                        value={option.id}
                                    >
                                        {({ selected, active }) => (
                                            <div className="flex items-center justify-between">
                                                <span className="block truncate">{option.label}</span>
                                                {selected && (
                                                    <Check className={`w-5 h-5 ${active ? "text-emerald-700" : "text-emerald-500"}`} />
                                                )}
                                            </div>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </div>
    );
}
