import { useState } from "react";
import { Alert, Button, FormControlLabel, MenuItem, Switch, TextField } from "@mui/material";
import { CameraAltOutlined } from "@mui/icons-material";
import { FormikProvider, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { authAPI } from "../../utils/api";
import { setUser } from "../../store/slices/authSlice";

const profileSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  phone: Yup.string(),
  timezone: Yup.string(),
});

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      timezone: user?.timezone || "IST",
    },
    enableReinitialize: true,
    validationSchema: profileSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await authAPI.updateProfile({
          fullName: values.fullName,
          phone: values.phone,
          timezone: values.timezone,
        });
        // Update Redux user state with fresh data from server
        dispatch(setUser(result.user || result));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch {
        alert("Failed to save profile.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDeactivate = () => {
    if (window.confirm("Are you sure you want to deactivate your account?")) {
      alert("Account deactivation is not yet supported.");
    }
  };

  return (
    <FormikProvider value={formik}>
      <div className="space-y-4">
        {/* Success banner */}
        {success && <Alert severity="success">Profile saved successfully!</Alert>}

        {/* Profile form card */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#6366F1] text-xl font-bold text-white">
              {(user?.fullName || "IF").slice(0, 2).toUpperCase()}
              <span className="absolute -bottom-1 -right-1 rounded-full bg-white p-1 shadow">
                <CameraAltOutlined fontSize="small" />
              </span>
            </div>
            <p className="text-lg font-semibold">Personal Profile</p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextField
                label="Full Name"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                helperText={formik.touched.fullName && formik.errors.fullName}
              />
              {/* Email is read-only — cannot change email */}
              <TextField label="Email" name="email" value={formik.values.email} disabled />
              <TextField
                label="Phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
              />
              <TextField
                select
                label="Timezone"
                name="timezone"
                value={formik.values.timezone}
                onChange={formik.handleChange}
              >
                <MenuItem value="IST">IST — India Standard Time</MenuItem>
                <MenuItem value="UTC">UTC — Coordinated Universal Time</MenuItem>
                <MenuItem value="EST">EST — Eastern Standard Time</MenuItem>
                <MenuItem value="PST">PST — Pacific Standard Time</MenuItem>
              </TextField>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                className="text-sm font-medium text-red-500"
                onClick={handleDeactivate}
              >
                Deactivate Account
              </button>
              <div className="flex gap-3">
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
            </div>
          </form>
        </div>

        {/* Notifications + security */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold">Email Notifications</h3>
          <FormControlLabel control={<Switch defaultChecked />} label="Invoice due reminders" />
          <FormControlLabel control={<Switch />} label="Weekly summary reports" />
          <div className="mt-4 rounded-lg border border-slate-200 p-4">
            <p className="font-semibold">Two-Factor Authentication</p>
            <p className="text-sm text-slate-500">Add extra security to your account.</p>
            <Button
              sx={{ mt: 2 }}
              variant="outlined"
              onClick={() => alert("2FA is coming soon!")}
            >
              Enable 2FA
            </Button>
          </div>
        </div>
      </div>
    </FormikProvider>
  );
};

export default ProfileSettings;
