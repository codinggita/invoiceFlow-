import { useEffect, useState } from "react";
import { Button, CircularProgress, Alert } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ClientForm from "../../components/clients/ClientForm";
import { clientsAPI } from "../../utils/api";
import { addClient, updateClient } from "../../store/slices/clientSlice";

const AddEditClient = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = Boolean(id); // /clients/add vs /clients/:id/edit

  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState(null);

  // In edit mode, fetch the client by id to pre-fill the form
  useEffect(() => {
    if (!isEdit) return;
    clientsAPI.getById(id)
      .then((data) => setExisting(data))
      .catch(() => setError("Could not load client."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  // Map API fields to form field names
  const initialValues = {
    fullName: existing?.fullName || "",
    email: existing?.email || "",
    phone: existing?.phone || "",
    companyName: existing?.companyName || "",
    gstNumber: existing?.gstNumber || "",
    website: existing?.website || "",
    addressLine1: existing?.addressLine1 || "",
    addressLine2: existing?.addressLine2 || "",
    city: existing?.city || "",
    state: existing?.state || "",
    pincode: existing?.pincode || "",
  };

  const handleSubmit = async (values) => {
    // Map form fields to API payload
    const payload = {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      companyName: values.companyName,
      gstNumber: values.gstNumber,
      website: values.website,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      city: values.city,
      state: values.state,
      pincode: values.pincode,
    };

    try {
      if (isEdit) {
        const result = await clientsAPI.update(id, payload);
        dispatch(updateClient(result));
      } else {
        const result = await clientsAPI.create(payload);
        dispatch(addClient(result));
      }
      navigate("/clients");
    } catch {
      alert("Failed to save client.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <CircularProgress sx={{ color: "#6366F1" }} />
      </div>
    );
  }
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/clients")}>
          Back
        </Button>
        <h1 className="text-2xl font-semibold">
          {isEdit ? "Edit Client" : "Add New Client"}
        </h1>
      </div>
      <ClientForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        title={isEdit ? "Edit Client" : "Add New Client"}
      />
    </div>
  );
};

export default AddEditClient;


