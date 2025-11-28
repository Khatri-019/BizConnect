import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { credentialsSchema } from "./credentialsSchema";
import { authAPI } from "../../services/api";
import { LuUser, LuLock, LuArrowRight, LuLoader } from "react-icons/lu";
import SignupCard from "./SignupCard";
import { Button, Input, Label } from "../../form_ui";
import "./ExpertSignupForm.css";

function SignupCredentials({ onNext }) {
  const {
    register,
    handleSubmit,
    trigger,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(credentialsSchema),
    mode: "onBlur",
  });

  const usernameRegister = register("username");

  // Check username availability on blur for instant feedback
  const handleUsernameBlur = async (e) => {
    const value = e.target.value.trim();
    await usernameRegister.onBlur(e);
    
    const isFormatValid = await trigger("username");
    if (!isFormatValid || !value) return;

    try {
      await authAPI.checkUsername(value);
      // Username is available - no action needed
    } catch (error) {
      if (error.response?.status === 409) {
        setError("username", {
          type: "manual",
          message: "This username is already taken",
        });
      }
    }
  };

  // Final validation before moving to step 2
  const onSubmit = async (data) => {
    try {
      // Server-side validation
      await authAPI.checkUsername(data.username);
      
      // Success - pass credentials to parent
      onNext({
        username: data.username.trim(),
        password: data.password,
      });
    } catch (error) {
      if (error.response?.status === 409) {
        setError("username", {
          type: "manual",
          message: "This username is already taken",
        });
      } else {
        setError("root", {
          type: "manual",
          message: "Something went wrong. Please try again.",
        });
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
              autoComplete="username"
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
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          {errors.root && (
            <p className="error-message" style={{ textAlign: "center" }}>
              {errors.root.message}
            </p>
          )}

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
