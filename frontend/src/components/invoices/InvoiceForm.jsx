import { FieldArray, FormikProvider, useFormik } from "formik";
import { Button, MenuItem, TextField } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { invoiceSchema } from "../../utils/validators";

// Shared invoice form for both Create and Edit pages
const InvoiceForm = ({
  clients,
  initialValues,
  onSubmit,
  submitLabel = "Send Invoice",
  isEdit = false,
  onDelete,
  onDraft,
}) => {
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: invoiceSchema,
    onSubmit,
  });

  // Calculate totals from items
  // Using qty field name which is what our form uses
  const subtotal = formik.values.items.reduce(
    (sum, item) => sum + Number(item.qty || 0) * Number(item.unitPrice || 0),
    0
  );
  const taxValue = subtotal * (Number(formik.values.taxRate || 0) / 100);
  const total = subtotal + taxValue - Number(formik.values.discount || 0);

  // Find selected client by _id for preview block
  const selectedClient = clients.find(
    (c) => String(c._id) === String(formik.values.clientId)
  );

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow-sm">

        {/* Section 1 - Invoice Details */}
        <h2 className="text-lg font-semibold">Invoice Details</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TextField
            label="Invoice Number"
            name="invoiceNumber"
            value={formik.values.invoiceNumber}
            onChange={formik.handleChange}
            placeholder="Auto Generated"
            disabled
          />
          <TextField
            label="Issue Date"
            type="date"
            name="issueDate"
            value={formik.values.issueDate}
            onChange={formik.handleChange}
            InputLabelProps={{ shrink: true }}
            error={formik.touched.issueDate && Boolean(formik.errors.issueDate)}
            helperText={formik.touched.issueDate && formik.errors.issueDate}
          />
          <TextField
            label="Due Date"
            type="date"
            name="dueDate"
            value={formik.values.dueDate}
            onChange={formik.handleChange}
            InputLabelProps={{ shrink: true }}
            error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
            helperText={formik.touched.dueDate && formik.errors.dueDate}
          />
        </div>

        {/* Section 2 - Client Selection */}
        <h2 className="text-lg font-semibold">Bill To</h2>
        <TextField
          fullWidth
          select
          label="Select Client"
          name="clientId"
          value={formik.values.clientId}
          onChange={formik.handleChange}
          error={formik.touched.clientId && Boolean(formik.errors.clientId)}
          helperText={formik.touched.clientId && formik.errors.clientId}
        >
          {clients.map((client) => (
            <MenuItem key={client._id} value={String(client._id)}>
              {/* ✅ Fixed: using fullName instead of name */}
              {client.fullName} {client.companyName ? `- ${client.companyName}` : ""}
            </MenuItem>
          ))}
        </TextField>

        {/* Show selected client details below dropdown */}
        {selectedClient && (
          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700 space-y-1">
            {/* ✅ Fixed: using fullName instead of name */}
            <p className="font-medium">{selectedClient.fullName}</p>
            {selectedClient.email      && <p>{selectedClient.email}</p>}
            {selectedClient.phone      && <p>{selectedClient.phone}</p>}
            {selectedClient.companyName && <p>{selectedClient.companyName}</p>}
            {selectedClient.addressLine1 && <p>{selectedClient.addressLine1}</p>}
          </div>
        )}

        {/* Section 3 - Invoice Items */}
        <h2 className="text-lg font-semibold">Invoice Items</h2>
        <FieldArray
          name="items"
          render={(arrayHelpers) => (
            <div className="space-y-3">
              {formik.values.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <TextField
                    className="col-span-5"
                    label="Description"
                    name={`items.${index}.description`}
                    value={item.description}
                    onChange={formik.handleChange}
                  />
                  {/* qty is used in form display only */}
                  {/* it gets mapped to quantity when sending to backend */}
                  <TextField
                    className="col-span-2"
                    label="Qty"
                    type="number"
                    name={`items.${index}.qty`}
                    value={item.qty}
                    onChange={formik.handleChange}
                    inputProps={{ min: 1 }}
                  />
                  <TextField
                    className="col-span-3"
                    label="Unit Price"
                    type="number"
                    name={`items.${index}.unitPrice`}
                    value={item.unitPrice}
                    onChange={formik.handleChange}
                    inputProps={{ min: 0 }}
                  />
                  {/* Auto calculated row total */}
                  <div className="col-span-1 flex items-center justify-center text-sm font-semibold text-[#6366F1]">
                    ${(Number(item.qty || 0) * Number(item.unitPrice || 0)).toFixed(2)}
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Button
                      color="error"
                      onClick={() => arrayHelpers.remove(index)}
                      disabled={formik.values.items.length === 1}
                    >
                      <DeleteOutline />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outlined"
                onClick={() => arrayHelpers.push({ description: "", qty: 1, unitPrice: 0 })}
              >
                + Add Item
              </Button>
            </div>
          )}
        />

        {/* Section 4 - Summary */}
        <h2 className="text-lg font-semibold">Summary</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* ✅ Fixed: field name is taxRate to match backend */}
          <TextField
            label="Tax %"
            name="taxRate"
            type="number"
            value={formik.values.taxRate}
            onChange={formik.handleChange}
            inputProps={{ min: 0, max: 100 }}
          />
          <TextField
            label="Discount ($)"
            name="discount"
            type="number"
            value={formik.values.discount}
            onChange={formik.handleChange}
            inputProps={{ min: 0 }}
          />
          <div className="rounded-lg bg-indigo-50 p-4 text-center">
            <p className="text-sm text-slate-500">Subtotal: ${subtotal.toFixed(2)}</p>
            <p className="text-sm text-slate-500">Tax: ${taxValue.toFixed(2)}</p>
            <p className="mt-1 text-2xl font-bold text-[#6366F1]">
              Total: ${total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Section 5 - Notes and Terms */}
        <TextField
          fullWidth
          multiline
          minRows={2}
          label="Notes"
          name="notes"
          value={formik.values.notes}
          onChange={formik.handleChange}
        />
        <TextField
          fullWidth
          multiline
          minRows={2}
          label="Terms"
          name="terms"
          value={formik.values.terms}
          onChange={formik.handleChange}
        />

        {/* Bottom Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            {isEdit && onDelete && (
              <Button variant="outlined" color="error" onClick={onDelete}>
                Delete Invoice
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outlined" onClick={onDraft} type="button">
              Save as Draft
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "#6366F1" }}
            >
              {submitLabel}
            </Button>
          </div>
        </div>

      </form>
    </FormikProvider>
  );
};

export default InvoiceForm;