import { Autocomplete, Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Step, StepLabel, Stepper, TextField } from "@mui/material";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AddressDetails, PersonalDetails } from "./types/types";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "./redux/userSlice";
import CustomDataTable from "./DataTable";
import useCountryOptions from "./hooks/useCountryOption";

const schemaStep1: any = yup.object().shape({
    name: yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
    age: yup.number().required("Age is required").positive("Age must be a positive integer"),
    sex: yup.string().required("Sex is required").oneOf(["Male", "Female"], "Invalid sex"),
    mobile: yup
        .string()
        .required("Mobile is required")
        .matches(/^(\+\d{1,2}\s?)?(\d{10})$/, "Invalid mobile number"),
    govIdType: yup
        .string()
        .required("Govt Issued ID type is required")
        .oneOf(["Aadhar", "PAN"] as const, "Invalid ID type"),
    govIdNumber: yup
        .string()
        .required("Govt Issued ID number is required")
        .test({
            name: "govIdType",
            exclusive: false,
            message: "Invalid Govt Issued ID number",
            test: function (value: string | undefined) {
                const govIdType = this.parent.govIdType;

                if (govIdType === "Aadhar") {
                    return !value || (value.length === 12 && /^[2-9]\d{11}$/.test(value));
                } else {
                    return !value || (value.length === 10 && /^[A-Z0-9]+$/.test(value));
                }
            },
        }),
});

const schemaStep2: yup.ObjectSchema<AddressDetails> = yup.object().shape({
    address: yup.string(),
    state: yup.string(),
    city: yup.string(),
    country: yup.string(),
    pincode: yup.number().typeError("Pincode must be a number"),
});

const RegistrationForm = () => {
    const [data, setData] = useState<PersonalDetails | AddressDetails>();
    const { countryOptions, loading, handleInputChange } = useCountryOptions();
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const methods = useForm({
        resolver: yupResolver(activeStep === 0 ? schemaStep1 : schemaStep2) as any,
    });
    const users = useSelector((state: any) => state.user.users);
    console.log("users :>> ", users);
    const {
        handleSubmit,
        formState: { errors },
        setError,
        reset,
        clearErrors,
    } = methods;

    const schema1Validation = () => {
        schemaStep1
            .validate(methods.getValues(), { abortEarly: false })
            .then(() => {
                console.log("methods.getValues() :>> ", methods.getValues());
                setData(methods.getValues());
                clearErrors();
                reset();
                // dispatch(addUser({ personal: methods.getValues() }));
                setActiveStep((prevStep) => prevStep + 1);
            })
            .catch((validationErrors: any) => {
                console.log("validationErrors", validationErrors);
                const formattedErrors: Record<string, string[] | any> = {};
                validationErrors?.inner?.forEach((error: any) => {
                    formattedErrors[error.path] = formattedErrors[error.path] ? [...formattedErrors[error.path], error.message] : [error.message];
                });

                Object.keys(formattedErrors).forEach((fieldName: any) => {
                    setError(fieldName, {
                        type: "manual",
                        message: formattedErrors[fieldName],
                    });
                }) as any;
                return;
            });
    };

    console.log("data", data);
    const handleNext = async () => {
        console.log("i am in handleNext");

        if (activeStep === 0) {
            schema1Validation();
        }
    };

    const handleBack = () => {
        // const keys = Object.keys(data);
        // keys.map((key) => {
        //     methods.setValue(key, data[key]);
        // });

        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleStep2Submit = async (addressData: AddressDetails) => {
        // Additional validations for step 2
        await schemaStep2
            .validate(data, { abortEarly: false })
            .then(() => {
                dispatch(addUser({ ...data, ...addressData }));
                setActiveStep(0);
            })
            .catch((validationErrors) => {
                const formattedErrors: Record<string, string[] | any> = {};
                validationErrors.inner.forEach((error: any) => {
                    formattedErrors[error?.path] = formattedErrors[error.path] ? [...formattedErrors[error.path], error.message] : [error.message];
                });

                Object.keys(formattedErrors).forEach((fieldName) => {
                    setError(fieldName, {
                        type: "manual",
                        message: formattedErrors[fieldName],
                    });
                });
                setActiveStep(1);
            });
        setData({});
        reset();
    };
    console.log("methods :>> ", methods);
    console.log("methods :>> ", errors);
    console.log("data :>> ", data);
    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box component="form" sx={{ mt: 3 }}>
                        <Grid container spacing={3} sx={{ paddingX: "30px" }}>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    {...methods.register("name")}
                                    label="Name"
                                    margin="normal"
                                    helperText={Array.isArray(errors?.name?.message) ? errors?.name?.message.map((err) => <p key={err}>{err}</p>) : <p>{errors?.name?.message as any}</p>}
                                    // value={}
                                    onChange={() => {
                                        clearErrors("name");
                                    }}
                                    error={!!errors.name}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    {...methods.register("age")}
                                    label="Age"
                                    type="number"
                                    margin="normal"
                                    helperText={Array.isArray(errors?.age?.message) ? errors?.age?.message.map((err) => <p key={err}>{err}</p>) : <p>{errors?.age?.message as any}</p>}
                                    error={!!errors.age}
                                    onChange={() => {
                                        clearErrors("age");
                                    }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth margin="normal" error={!!errors.sex}>
                                    <InputLabel id="sex">Sex</InputLabel>
                                    <Select
                                        {...methods.register("sex")}
                                        onChange={() => {
                                            clearErrors("sex");
                                        }}
                                        error={!!errors.sex}
                                        labelId="sex"
                                        label="Sex"
                                    >
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                    </Select>

                                    {Array.isArray(errors.sex?.message) &&
                                        errors.sex.message.length > 0 &&
                                        errors.sex.message.map((err, i) => {
                                            return <FormHelperText key={i}>{err}</FormHelperText>;
                                        })}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    {...methods.register("mobile")}
                                    label="Mobile"
                                    margin="normal"
                                    helperText={
                                        Array.isArray(errors.mobile?.message) &&
                                        errors.mobile.message.length > 0 &&
                                        errors.mobile.message.map((err) => {
                                            return <p>{err}</p>;
                                        })
                                    }
                                    error={!!errors.mobile}
                                    onChange={() => {
                                        clearErrors("mobile");
                                    }}
                                    sx={{ width: "70%" }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2} md={3}>
                                <FormControl margin="normal" error={!!errors.govIdType} fullWidth>
                                    <InputLabel>Govt Issued ID</InputLabel>
                                    <Select
                                        {...methods.register("govIdType")}
                                        onChange={() => {
                                            clearErrors("govIdType");
                                        }}
                                        label="ID Type"
                                    >
                                        <MenuItem value="Aadhar">Aadhar</MenuItem>
                                        <MenuItem value="PAN">PAN</MenuItem>
                                    </Select>
                                    {Array.isArray(errors.govIdType?.message) &&
                                        errors.govIdType.message.length > 0 &&
                                        errors.govIdType.message.map((err, i) => {
                                            return <FormHelperText key={i}>{err}</FormHelperText>;
                                        })}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3}>
                                <TextField
                                    {...methods.register("govIdNumber")}
                                    label="Enter Govt ID"
                                    margin="normal"
                                    helperText={
                                        Array.isArray(errors.govIdNumber?.message) &&
                                        errors.govIdNumber.message.length > 0 &&
                                        errors.govIdNumber.message.map((err) => {
                                            return <p>{err}</p>;
                                        })
                                    }
                                    error={!!errors.govIdNumber}
                                    onChange={() => {
                                        clearErrors("govIdNumber");
                                    }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} display="flex" alignItems="center" justifyContent="center">
                                <Button variant="contained" onClick={handleNext}>
                                    Next
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                );
            case 1:
                return (
                    <Box component="form" onSubmit={handleSubmit(handleStep2Submit)} sx={{ mt: 3 }}>
                        <Grid container spacing={3} sx={{ paddingX: "30px" }}>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField {...methods.register("address")} label="Address" margin="normal" fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField {...methods.register("state")} label="State" margin="normal" fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField {...methods.register("city")} label="City" margin="normal" fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <Autocomplete
                                    options={countryOptions}
                                    loading={loading}
                                    getOptionLabel={(option: any) => option.name}
                                    // {...methods.register("country")}
                                    onChange={(event, value: any) => {
                                        console.log("event :>> ", event);
                                        console.log("value", value);
                                        setData((prevData) => ({
                                            ...prevData,
                                            country: value ? value.name : null,
                                        }));
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Country" margin="normal" fullWidth onChange={(e) => handleInputChange(e.target.value)} />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField {...methods.register("pincode")} label="Pincode" type="number" margin="normal" fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={6} md={12} display="flex" alignItems="center" justifyContent="space-around">
                                <Button variant="contained" onClick={handleBack}>
                                    Back
                                </Button>
                                <Button variant="contained" type="submit">
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                );
            default:
                return null;
        }
    };
    const columns = [
        { data: "name", title: "Name" },
        { data: "age", title: "Age" },
        { data: "sex", title: "Sex" },
        { data: "mobile", title: "Mobile" },
        { data: "govIdType", title: "Govt Issued ID" },
        { data: "govIdNumber", title: "Govt ID" },
        { data: "address", title: "Address" },
        { data: "state", title: "State" },
        { data: "city", title: "City" },
        { data: "country", title: "Country" },
        { data: "pincode", title: "Pincode" },
    ];
    return (
        <FormProvider {...methods}>
            <Stepper activeStep={activeStep} alternativeLabel>
                <Step key="PersonalDetails">
                    <StepLabel>Personal Details</StepLabel>
                </Step>
                <Step key="AddressDetails">
                    <StepLabel>Address Details</StepLabel>
                </Step>
            </Stepper>
            {getStepContent(activeStep)}
            {users.length > 0 && <CustomDataTable data={users} columns={columns} />}
            <Box sx={{ height: "200px" }}></Box>
        </FormProvider>
    );
};

export default RegistrationForm;
