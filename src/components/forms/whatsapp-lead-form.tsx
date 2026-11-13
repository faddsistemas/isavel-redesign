"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface Field {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}

interface WhatsAppLeadFormProps {
  title: string;
  intro?: string;
  fields: Field[];
  messagePrefix: string;
  submitLabel: string;
}

export function WhatsAppLeadForm({
  title,
  intro,
  fields,
  messagePrefix,
  submitLabel,
}: WhatsAppLeadFormProps) {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const lines = [messagePrefix, ""];
    for (const field of fields) {
      const val = fd.get(field.name);
      if (val) lines.push(`${field.label}: ${val}`);
    }
    lines.push("", "Enviado pelo site Isavel Veículos.");
    const url = buildWhatsAppUrl(lines.join("\n"));
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-xl border border-border bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-primary">{title}</h2>
        {intro ? <p className="text-sm text-muted-foreground">{intro}</p> : null}
      </div>
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1.5">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            id={field.name}
            name={field.name}
            type={field.type ?? "text"}
            required={field.required}
            placeholder={field.placeholder}
            className="min-h-11"
          />
        </div>
      ))}
      <Button type="submit" size="lg" className="min-h-11 w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
