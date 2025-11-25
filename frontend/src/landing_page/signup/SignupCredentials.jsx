import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { credentialsSchema } from "./credentialsSchema";
import { LuUser, LuLock, LuArrowRight, LuLoader } from "react-icons/lu";
import SignupCard from "./SignupCard";
import Button from "./Button";
import Input from "./Input";
import Label from "./Label";
import "./ExpertSignupForm.css";

function SignupCredentials({ onNext }) {
  const {
    register,
    handleSubmit,
    trigger,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(credentialsSchema),
    mode: "onBlur",
  });

  const usernameRegister = register("username");

  // Keep your blur handler for visual feedback
  const handleUsernameBlur = async (e) => {
    const value = e.target.value;
    await usernameRegister.onBlur(e);
    const isFormatValid = await trigger("username");
    
    if (isFormatValid && value) {
      try {
        await axios.post("http://localhost:5000/api/auth/check-username", { username: value });
      } catch (error) {
        if (error.response && error.response.status === 409) {
          setError("username", { 
            type: "manual", 
            message: "This username is already taken" 
          });
        }
      }
    }
  };

  // --- KEY FIX: Perform Final Check in onSubmit ---
  const onSubmit = async (data) => {
    try {
      // 1. Final server-side validation before moving to Step 2
      await axios.post("http://localhost:5000/api/auth/check-username", { 
        username: data.username 
      });
      
      // 2. If successful (no error thrown), proceed
      onNext(data);
      
    } catch (error) {
      // 3. If error, block progress and show message
      if (error.response && error.response.status === 409) {
        setError("username", { 
          type: "manual", 
          message: "This username is already taken" 
        });
      } else {
        console.error("Validation error:", error);
      }
    }
  };

  return (
    <SignupCard className="signup-card-step-1">
      <div className="signup-card-header">
        <h1 className="signup-card-title">Join as an Expert</h1>
        <p className="signup-card-description">
          Create your account to start offering your services globally.
        </p>
      </div>

      <div className="signup-card-content">
        {/* Note: handleSubmit is async-aware, so it waits for our async onSubmit */}
        <form onSubmit={handleSubmit(onSubmit)} className="expert-form">
          
          <div className="form-group">
            <Label htmlFor="username">
              <LuUser className="label-icon" />
              Username
            </Label>
            <Input
              id="username"
              {...usernameRegister}
              onBlur={handleUsernameBlur}
              placeholder="Choose a unique username"
            />
            {errors.username && (
              <p className="error-message">{errors.username.message}</p>
            )}
          </div>

          <div className="form-group">
            <Label htmlFor="password">
              <LuLock className="label-icon" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Create a strong password"
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            style={{ marginTop: "1rem" }}
          >
            {isSubmitting ? (
              <>
                <LuLoader className="button-icon spinner" />
                Verifying...
              </>
            ) : (
              <>
                Next Step <LuArrowRight />
              </>
            )}
          </Button>
        </form>
      </div>
    </SignupCard>
  );
}

export default SignupCredentials;