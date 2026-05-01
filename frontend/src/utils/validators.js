import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required")
});

export const registerSchema = Yup.object({
  fullName: Yup.string().min(2, "Minimum 2 characters").required("Full name is required"),
  businessName: Yup.string().required("Business name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required")
});

export const clientSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  companyName: Yup.string().required("Company name is required"),
  addressLine1: Yup.string().required("Address line 1 is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Pincode must be 6 digits")
    .required("Pincode is required")
});

export const invoiceSchema = Yup.object({
  clientId: Yup.string().required("Client is required"),
  issueDate: Yup.string().required("Issue date is required"),
  dueDate: Yup.string().required("Due date is required"),
  items: Yup.array()
    .of(
      Yup.object({
        description: Yup.string().required("Description is required"),
        qty: Yup.number().min(1, "Min 1").required("Qty required"),
        unitPrice: Yup.number().min(0, "Cannot be negative").required("Unit price required")
      })
    )
    .min(1, "At least 1 item is required")
});
