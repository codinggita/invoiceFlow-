import { useState } from "react";
import { Alert, Button, TextField } from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { authAPI } from "../../utils/api";
import { setUser } from "../../store/slices/authSlice";

const businessSchema = Yup.object({
  businessName: Yup.string().required("Business name is required"),
});

const BusinessInfo = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      businessName: user?.businessName || "",
      gstNumber: user?.gstNumber || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      pincode: user?.pincode || "",
    },
    enableReinitialize: true,
    validationSchema: businessSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await authAPI.updateProfile(values);
        dispatch(setUser(result.user || result));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch {
        alert("Failed to save business info.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <div className="space-y-4">
        {success && <Alert severity="success">Business info saved successfully!</Alert>}

        {/* Business info form card */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Business Information</h2>

          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextField
                label="Business Name"
                name="businessName"
                value={formik.values.businessName}
                onChange={formik.handleChange}
                error={formik.touched.businessName && Boolean(formik.errors.businessName)}
                helperText={formik.touched.businessName && formik.errors.businessName}
              />
              <TextField
                label="GST Number"
                name="gstNumber"
                value={formik.values.gstNumber}
                onChange={formik.handleChange}
              />
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Business Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                className="md:col-span-2"
              />
              <TextField
                label="City"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
              />
              <TextField
                label="State"
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange}
              />
              <TextField
                label="Pincode"
                name="pincode"
                value={formik.values.pincode}
                onChange={formik.handleChange}
              />
            </div>

            {/* Logo upload placeholder */}
            <div className="my-4 rounded-lg border-2 border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
              Upload Business Logo (coming soon)
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
                {formik.isSubmitting ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>

        {/* Public info banner */}
        <Alert severity="info">
          Public Information: This data appears on your invoices.
        </Alert>
      </div>
    </FormikProvider>
  );
};

export default BusinessInfo;
