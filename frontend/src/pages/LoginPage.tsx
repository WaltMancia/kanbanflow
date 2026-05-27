import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import { api } from "../api/client";

import { useAuthStore } from "../store/authStore";

export default function LoginPage () {
    const navigate = useNavigate();

    const login =
        useAuthStore(
            (state) => state.login
        );

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    async function handleLogin (
        e: React.FormEvent
    ) {
        e.preventDefault();

        try {
            setLoading(true);

            const response =
                await api.post(
                    "/auth/login",
                    {
                        email,
                        password,
                    }
                );

            const data = response.data;

            login(data.token, {
                name: data.name,
                email: data.email,
                role: data.role,
            });

            navigate("/");
        } catch {
            alert("Invalid credentials");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
            <motion.form
                initial={ {
                    opacity: 0,
                    y: 30,
                } }
                animate={ {
                    opacity: 1,
                    y: 0,
                } }
                onSubmit={ handleLogin }
                className="w-full max-w-md bg-surface border border-border rounded-3xl p-8 shadow-2xl"
            >
                <h1 className="text-4xl font-bold mb-2">
                    KanbanFlow
                </h1>

                <p className="text-slate-400 mb-8">
                    Project Management System
                </p>

                <div className="space-y-5">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 outline-none"
                        value={ email }
                        onChange={ (e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 outline-none"
                        value={ password }
                        onChange={ (e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                    />

                    <button
                        disabled={ loading }
                        className="w-full bg-primary hover:opacity-90 transition rounded-xl py-3 font-semibold"
                    >
                        { loading
                            ? "Loading..."
                            : "Login" }
                    </button>
                </div>
            </motion.form>
        </div>
    );
}