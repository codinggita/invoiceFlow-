import { FormikProvider, useFormik } from "formik";
import { Button, TextField } from "@mui/material";
import { clientSchema } from "../../utils/validators";

const ClientForm = ({ initialValues, onSubmit, title = "Add New Client" }) => {
  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // allows pre-fill when edit data loads async
    validationSchema: clientSchema,
    onSubmit
  });

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold">{title}</h2>

        <h3 className="mb-3 text-base font-semibold">Personal Info</h3>
        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField label="Full Name" name="fullName" value={formik.values.fullName} onChange={formik.handleChange} error={formik.touched.fullName && Boolean(formik.errors.fullName)} helperText={formik.touched.fullName && formik.errors.fullName} />
          <TextField label="Email" name="email" value={formik.values.email} onChange={formik.handleChange} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} />
          <TextField label="Phone" name="phone" value={formik.values.phone} onChange={formik.handleChange} error={formik.touched.phone && Boolean(formik.errors.phone)} helperText={formik.touched.phone && formik.errors.phone} />
        </div>

        <h3 className="mb-3 text-base font-semibold">Business Info</h3>
        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField label="Company Name" name="companyName" value={formik.values.companyName} onChange={formik.handleChange} error={formik.touched.companyName && Boolean(formik.errors.companyName)} helperText={formik.touched.companyName && formik.errors.companyName} />
          <TextField label="GST Number (Optional)" name="gstNumber" value={formik.values.gstNumber} onChange={formik.handleChange} />
          <TextField label="Website (Optional)" name="website" value={formik.values.website} onChange={formik.handleChange} />
        </div>

        <h3 className="mb-3 text-base font-semibold">Billing Address</h3>
        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField label="Address Line 1" name="addressLine1" value={formik.values.addressLine1} onChange={formik.handleChange} error={formik.touched.addressLine1 && Boolean(formik.errors.addressLine1)} helperText={formik.touched.addressLine1 && formik.errors.addressLine1} />
          <TextField label="Address Line 2 (Optional)" name="addressLine2" value={formik.values.addressLine2} onChange={formik.handleChange} />
          <TextField label="City" name="city" value={formik.values.city} onChange={formik.handleChange} error={formik.touched.city && Boolean(formik.errors.city)} helperText={formik.touched.city && formik.errors.city} />
          <TextField label="State" name="state" value={formik.values.state} onChange={formik.handleChange} error={formik.touched.state && Boolean(formik.errors.state)} helperText={formik.touched.state && formik.errors.state} />
          <TextField label="Pincode" name="pincode" value={formik.values.pincode} onChange={formik.handleChange} error={formik.touched.pincode && Boolean(formik.errors.pincode)} helperText={formik.touched.pincode && formik.errors.pincode} />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outlined">Cancel</Button>
          <Button type="submit" variant="contained" sx={{ backgroundColor: "#6366F1" }}>
            Save Client
          </Button>
        </div>
      </form>
    </FormikProvider>
  );
};

export default ClientForm;
