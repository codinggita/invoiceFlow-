import { Link, useNavigate } from "react-router-dom";
import { FormikProvider, useFormik } from "formik";
import { Button, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { registerSchema } from "../../utils/validators";
import { loginSuccess } from "../../store/slices/authSlice";
import { authAPI } from "../../utils/api";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      businessName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        // Send registration data to real backend API
        const data = await authAPI.register({
          fullName: values.fullName,
          businessName: values.businessName,
          email: values.email,
          password: values.password,
        });
        if (data.token) {
          // Auto-login after successful registration
          dispatch(loginSuccess({ user: data.user, token: data.token }));
          navigate("/dashboard");
        } else {
          setFieldError("email", data.message || "Registration failed");
        }
      } catch (error) {
        setFieldError("email", "Something went wrong. Try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        {/* App branding */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#6366F1]">InvoiceFlow</h1>
          <p className="mt-2 text-sm font-medium text-[#0F172A]">Create your account</p>
        </div>

        {/* Register fields */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {[
            { name: "fullName", label: "Full Name" },
            { name: "businessName", label: "Business Name" },
            { name: "email", label: "Email" },
            { name: "password", label: "Password", type: "password" },
            { name: "confirmPassword", label: "Confirm Password", type: "password" },
          ].map((field) => (
            <TextField
              key={field.name}
              fullWidth
              type={field.type || "text"}
              label={field.label}
              name={field.name}
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
              helperText={formik.touched[field.name] && formik.errors[field.name]}
            />
          ))}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting}
            sx={{ backgroundColor: "#6366F1", borderRadius: "8px" }}
          >
            {formik.isSubmitting ? "Creating account…" : "Create Account"}
          </Button>
        </form>

        {/* Link to login */}
        <p className="mt-5 text-center text-sm text-[#64748B]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#6366F1]">
            Login
          </Link>
        </p>
      </div>
    </FormikProvider>
  );
};

export default Register;
