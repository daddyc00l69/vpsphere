"use client";

import { useState } from "react";
import { StepsIndicator } from "@/components/wizard/StepsIndicator";
import { RepoSelection } from "@/components/wizard/RepoSelection";
import { BuildConfiguration } from "@/components/wizard/BuildConfiguration";
import { DeployProgress } from "@/components/wizard/DeployProgress";
import api from "@vpsphere/api-client";

export default function NewServicePage() {
    const [step, setStep] = useState(1);
    const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

    const [isDeploying, setIsDeploying] = useState(false);
    const [deployError, setDeployError] = useState<string | null>(null);

    const handleRepoSelect = (repo: string) => {
        setSelectedRepo(repo);
        setStep(2);
    };

    const handleBuildSubmit = async () => {
        if (!selectedRepo) return;
        setIsDeploying(true);
        setDeployError(null);
        try {
            await api.deployments.deploy(selectedRepo);
            setStep(3);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            setDeployError(errorMessage || 'Deployment could not be initiated.');
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-vpsBackground dark:bg-background-dark p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto w-full">
                <StepsIndicator
                    currentStep={step}
                    steps={["Import Git Repository", "Configure Build", "Deploy"]}
                />

                <div className="mt-8">
                    {step === 1 && (
                        <RepoSelection onSelect={handleRepoSelect} />
                    )}
                    {step === 2 && (
                        <div>
                            {deployError && <div className="mb-4 bg-red-100 text-red-600 p-4 rounded">{deployError}</div>}
                            <BuildConfiguration
                                repoName={selectedRepo}
                                onBack={() => setStep(1)}
                                onDeploy={handleBuildSubmit}
                            />
                            {isDeploying && <p className="text-sm text-slate-500 mt-2">Starting deployment...</p>}
                        </div>
                    )}
                    {step === 3 && (
                        <DeployProgress />
                    )}
                </div>
            </div>
        </div>
    );
}
