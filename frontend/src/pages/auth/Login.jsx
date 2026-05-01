import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormikProvider, useFormik } from "formik";
import { Button, Divider, IconButton, InputAdornment, TextField } from "@mui/material";
import { MailOutline, Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { loginSchema } from "../../utils/validators";
import { loginSuccess } from "../../store/slices/authSlice";
import { authAPI } from "../../utils/api";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        // Call real backend API
        const data = await authAPI.login(values);
        if (data.token) {
          // Save token + user to Redux store and localStorage
          dispatch(loginSuccess({ user: data.user, token: data.token }));
          navigate("/dashboard");
        } else {
          // Show server error message in form
          setFieldError("email", data.message || "Invalid credentials");
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
          <p className="mt-2 text-sm text-[#64748B]">Manage invoices smarter</p>
        </div>

        {/* Login form fields */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutline fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div className="text-right">
            <button type="button" className="text-sm font-medium text-[#6366F1]">
              Forgot Password?
            </button>
          </div>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting}
            sx={{ backgroundColor: "#6366F1", borderRadius: "8px" }}
          >
            {formik.isSubmitting ? "Logging in…" : "Login"}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-4">
          <Divider>or</Divider>
        </div>
        <Button fullWidth variant="outlined">
          Continue with Google
        </Button>

        {/* Link to register */}
        <p className="mt-5 text-center text-sm text-[#64748B]">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-[#6366F1]">
            Register
          </Link>
        </p>
      </div>
    </FormikProvider>
  );
};

export default Login;
