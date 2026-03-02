import React, { useState, useEffect } from "react";
import { useTranslation } from "../contexts/TranslationContext.tsx";
import { Button } from "./ui/Button.tsx";
import {
  saveApiKey,
  getApiKey,
  deleteApiKey,
  hasApiKey,
} from "../services/apiKeyService.ts";
import {
  KeyIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from "./IconComponents.tsx";

interface ApiKeySetupProps {
  onKeyChanged?: () => void;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onKeyChanged }) => {
  const { t } = useTranslation();
  const [key, setKey] = useState("");
  const [keyExists, setKeyExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      const exists = await hasApiKey();
      setKeyExists(exists);
      setIsLoading(false);
    };
    checkKey();
  }, []);

  const handleSave = async () => {
    if (!key.trim()) return;
    await saveApiKey(key.trim());
    setKeyExists(true);
    setKey("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    onKeyChanged?.();
  };

  const handleDelete = async () => {
    await deleteApiKey();
    setKeyExists(false);
    setShowSuccess(false);
    onKeyChanged?.();
  };

  if (isLoading) return null;

  return (
    <div className="space-y-3">
      {/* Security Warning */}
      <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-300">
          {t("settings.apiKey.securityNote")}
        </p>
      </div>

      {/* Status */}
      {keyExists && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-700 dark:text-green-300">
            {t("settings.apiKey.configured")}
          </span>
          <button
            onClick={handleDelete}
            className="ml-auto text-red-500 hover:text-red-600 p-1"
            aria-label="Delete API key"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {showSuccess && (
        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm text-green-700 dark:text-green-300 text-center">
          {t("settings.apiKey.saved")}
        </div>
      )}

      {/* Input */}
      {!keyExists && (
        <div className="flex gap-2">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={t("settings.apiKey.placeholder")}
            className="flex-grow bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            aria-label={t("settings.apiKey.label")}
          />
          <Button onClick={handleSave} disabled={!key.trim()}>
            <KeyIcon className="w-4 h-4 mr-2" />
            {t("save")}
          </Button>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {t("settings.apiKey.help")}{" "}
        <a
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-600 dark:text-amber-400 hover:underline"
        >
          Google AI Studio &rarr;
        </a>
      </p>
    </div>
  );
};
