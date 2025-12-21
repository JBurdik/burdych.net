import { createFormHookContexts, createFormHook } from "@tanstack/react-form";

// Create contexts for field and form
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

// Import field components
import { TextField } from "../components/admin/fields/TextField";
import { TextareaField } from "../components/admin/fields/TextareaField";
import { SelectField } from "../components/admin/fields/SelectField";
import { CheckboxField } from "../components/admin/fields/CheckboxField";
import { TagInputField } from "../components/admin/fields/TagInputField";
import { SliderField } from "../components/admin/fields/SliderField";
import { SubmitButton } from "../components/admin/fields/SubmitButton";

// Create the form hook with all reusable components
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
    CheckboxField,
    TagInputField,
    SliderField,
  },
  formComponents: {
    SubmitButton,
  },
});
