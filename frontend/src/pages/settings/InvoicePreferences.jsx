import { useState } from "react";
import { Alert, Button, InputAdornment, MenuItem, TextField } from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { authAPI } from "../../utils/api";
import { setUser } from "../../store/slices/authSlice";
import { PAYMENT_TERMS } from "../../constants";

const prefsSchema = Yup.object({
  defaultTaxRate: Yup.number().min(0).max(100),
  invoicePrefix: Yup.string(),
});

const InvoicePreferences = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      defaultTaxRate: user?.defaultTaxRate ?? 18,
      defaultPayTerms: user?.defaultPayTerms || "Net 30",
      invoicePrefix: user?.invoicePrefix || "INV",
      defaultNotes: user?.defaultNotes || "",
      defaultTerms: user?.defaultTerms || "",
    },
    enableReinitialize: true,
    validationSchema: prefsSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await authAPI.updateProfile(values);
        dispatch(setUser(result.user || result));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch {
        alert("Failed to save preferences.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      {success && <Alert severity="success" className="mb-4">Preferences saved!</Alert>}

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Invoice Preferences</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Default tax rate */}
            <TextField
              label="Default Tax Rate"
              name="defaultTaxRate"
              type="number"
              value={formik.values.defaultTaxRate}
              onChange={formik.handleChange}
              inputProps={{ min: 0, max: 100 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />

            {/* Default payment terms */}
            <TextField
              select
              label="Default Payment Terms"
              name="defaultPayTerms"
              value={formik.values.defaultPayTerms}
              onChange={formik.handleChange}
            >
              {PAYMENT_TERMS.map((term) => (
                <MenuItem key={term} value={term}>{term}</MenuItem>
              ))}
            </TextField>

            {/* Invoice prefix */}
            <TextField
              label="Invoice Prefix"
              name="invoicePrefix"
              value={formik.values.invoicePrefix}
              onChange={formik.handleChange}
            />

            {/* Default notes */}
            <TextField
              className="md:col-span-2"
              label="Default Notes"
              name="defaultNotes"
              multiline
              minRows={3}
              value={formik.values.defaultNotes}
              onChange={formik.handleChange}
            />

            {/* Default terms */}
            <TextField
              className="md:col-span-2"
              label="Default Terms"
              name="defaultTerms"
              multiline
              minRows={3}
              value={formik.values.defaultTerms}
              onChange={formik.handleChange}
            />
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <Button variant="outlined" onClick={() => formik.resetForm()}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
              sx={{ backgroundColor: "#6366F1" }}
            >
              {formik.isSubmitting ? "Saving…" : "Save Preferences"}
            </Button>
          </div>
        </form>
      </div>
    </FormikProvider>
  );
};

export default InvoicePreferences;
