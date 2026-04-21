"use client";

import { RewardIcon } from "@/components/common/icon-svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatNumber, formatNumberWithCommas, isDecimalNumeric, isNumericOnly, removeCommas } from "@/lib/helper";
import { RewardRulesSectionProps } from "@/lib/types";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface RewardRuleItem {
  min: string;
  max: string;
  percentage: string;
}

const adjustSubsequentRules = (rules: RewardRuleItem[], startIndex: number) => {
  const updatedRules = [...rules];
  for (let i = startIndex; i < updatedRules.length; i++) {
    if (i > 0) {
      const prevMax = Number.parseFloat(updatedRules[i - 1].max);
      const nextMin = (prevMax + 1).toString();
      updatedRules[i] = { ...updatedRules[i], min: nextMin };
      if (Number.parseFloat(updatedRules[i].max) < prevMax + 1) {
        updatedRules[i].max = nextMin;
      }
    }
  }
  return updatedRules;
};

interface RulesTableProps {
  rewardRules: RewardRuleItem[];
  earnMethod: string;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

function RulesTable({ rewardRules, earnMethod, onEdit, onDelete }: Readonly<RulesTableProps>) {
  if (rewardRules.length === 0) return null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-4 text-sm border-b border-gray-200">
            <div className="font-medium text-theme-dark-green px-3 lg:px-4 py-3 text-left">Min</div>
            <div className="font-medium text-theme-dark-green px-3 lg:px-4 py-3 text-center">Max</div>
            <div className="font-medium text-theme-dark-green px-3 lg:px-4 py-3 text-right">Reward {earnMethod === "percentage" ? "%" : ""}</div>
            <div className="font-medium text-theme-dark-green px-3 lg:px-4 py-3 text-center">Actions</div>
          </div>
          {rewardRules.map((rule, index) => (
            <div key={index} className={`grid grid-cols-4 text-sm text-gray-900 ${index === rewardRules.length - 1 ? '' : 'border-b border-gray-200'}`}>
              <div className="px-3 lg:px-4 py-3 text-left">{formatNumber(rule.min)}</div>
              <div className="px-3 lg:px-4 py-3 text-center">{formatNumber(rule.max)}</div>
              <div className="px-3 lg:px-4 py-3 text-right">
                {rule.percentage}{earnMethod === "percentage" ? "%" : ""}
              </div>
              <div className="px-3 lg:px-4 py-3 text-center flex items-center justify-center gap-1 lg:gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(index)}
                  className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-gray-200"
                >
                  <Edit className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(index)}
                  className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden">
        {rewardRules.map((rule, index) => (
          <div key={index} className={`p-3 ${index === rewardRules.length - 1 ? '' : 'border-b border-gray-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-theme-dark-green">Rule {index + 1}</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(index)}
                  className="h-7 w-7 p-0 hover:bg-gray-200 rounded-full"
                >
                  <Edit className="h-3.5 w-3.5 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(index)}
                  className="h-7 w-7 p-0 hover:bg-red-100 rounded-full"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-600" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-xs text-gray-500 font-medium">Min Spending</span>
                <span className="text-sm text-gray-900 font-semibold">{rule.min}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-xs text-gray-500 font-medium">Max Spending</span>
                <span className="text-sm text-gray-900 font-semibold">{rule.max}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-gray-100 pt-2">
                <span className="text-xs text-gray-500 font-medium">Reward {earnMethod === "percentage" ? "Percentage" : "Amount"}</span>
                <span className="text-sm text-theme-dark-green font-semibold">
                  {rule.percentage}{earnMethod === "percentage" ? "%" : ""}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface RulesInputProps {
  earnMethod: string;
  minSpending: string;
  setMinSpending: (val: string) => void;
  maxSpending: string;
  setMaxSpending: (val: string) => void;
  rewardPercentage: string;
  setRewardPercentage: (val: string) => void;
  isMinEditable: boolean;
  isMinGreaterThanMax: boolean;
  isSaveRuleDisabled: boolean;
  handleSaveRule: () => void;
  handleCancelEdit: () => void;
  isEditing: boolean;
}

function RulesInput({
  earnMethod,
  minSpending,
  setMinSpending,
  maxSpending,
  setMaxSpending,
  rewardPercentage,
  setRewardPercentage,
  isMinEditable,
  isMinGreaterThanMax,
  isSaveRuleDisabled,
  handleSaveRule,
  handleCancelEdit,
  isEditing,
}: Readonly<RulesInputProps>) {
  return (
    <div className="space-y-4 sm:space-y-0">
      {/* Mobile Layout */}
      <div className="sm:hidden space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="min-spending" className="text-xs text-gray-600 mb-1 block">Min Spending</label>
            <Input
              type="text"
              placeholder="Min"
              value={minSpending}
              onChange={(e) => {
                if (isMinEditable) {
                  const value = e.target.value;
                  if (isNumericOnly(value)) {
                    setMinSpending(formatNumberWithCommas(value));
                  }
                }
              }}
              disabled={!isMinEditable}
              className={`w-full px-3 py-3 focus:outline-none focus:ring-0 focus:border-none ${isMinEditable ? "" : "bg-gray-100 cursor-not-allowed opacity-70"}`}
            />
          </div>
          <div>
            <label htmlFor="max-spending" className="text-xs text-gray-600 mb-1 block">Max Spending</label>
            <Input
              type="text"
              placeholder="Max"
              value={maxSpending}
              onChange={(e) => {
                const value = e.target.value;
                if (isNumericOnly(value)) {
                  setMaxSpending(formatNumberWithCommas(value));
                }
              }}
              className="w-full px-3 py-3 focus:outline-none focus:ring-0 focus:border-none"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Reward {earnMethod === "percentage" ? "Percentage" : "Amount"}</label>
          <div className="relative">
            <Input
              type="text"
              placeholder="0"
              value={rewardPercentage}
              onChange={(e) => {
                const value = e.target.value;
                if (isDecimalNumeric(value)) {
                  setRewardPercentage(value);
                }
              }}
              className="w-full pl-10 pr-3 py-3 focus:outline-none focus:ring-0 focus:border-none"
            />
            {earnMethod === "percentage" ? (
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none bg-theme-gray-700">%</span>
            ) : (
              <RewardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-dark-green pointer-events-none h-4 w-4" />
            )}
          </div>
        </div>
        {isMinGreaterThanMax && (
          <div className="text-xs text-red-500 font-medium">
            Min spending cannot be greater than max spending
          </div>
        )}
        <div className="flex gap-2">
          <Button
            onClick={handleSaveRule}
            disabled={isSaveRuleDisabled}
            className={`flex-1 py-3 text-sm ${isSaveRuleDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-theme-dark-green hover:bg-theme-dark-green/90 text-white"
              }`}
          >
            {isEditing ? "Update" : "Save"}
          </Button>
          {isEditing && (
            <Button
              onClick={handleCancelEdit}
              variant="outline"
              className="px-4 py-3 text-sm"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center gap-2 w-full">
        <Input
          type="text"
          placeholder="Min"
          value={minSpending}
          onChange={(e) => {
            if (isMinEditable) {
              const value = e.target.value;
              if (isNumericOnly(value)) {
                setMinSpending(formatNumberWithCommas(value));
              }
            }
          }}
          disabled={!isMinEditable}
          className={`flex-1 min-w-0 px-3 py-6 focus:outline-none focus:ring-0 focus:border-none ${isMinEditable ? "" : "bg-gray-100 cursor-not-allowed opacity-70"}`}
        />
        <span className="text-gray-500 shrink-0">-</span>
        <Input
          type="text"
          placeholder="Max. Spending"
          value={maxSpending}
          onChange={(e) => {
            const value = e.target.value;
            if (isNumericOnly(value)) {
              setMaxSpending(formatNumberWithCommas(value));
            }
          }}
          className="flex-1 min-w-0 px-3 py-6 focus:outline-none focus:ring-0 focus:border-none"
        />
        <span className="text-gray-500 shrink-0">=</span>
        <div className="flex-1 min-w-0 relative">
          <Input
            type="text"
            placeholder="0"
            value={rewardPercentage}
            onChange={(e) => {
              const value = e.target.value;
              if (isDecimalNumeric(value)) {
                setRewardPercentage(value);
              }
            }}
            className="w-full pl-10 pr-3 py-6 focus:outline-none focus:ring-0 focus:border-none"
          />
          {earnMethod === "percentage" ? (
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none bg-theme-gray-700">%</span>
          ) : (
            <RewardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-dark-green pointer-events-none h-4 w-4" />
          )}
        </div>
        <span className="text-gray-500 shrink-0">-</span>
        <div className="flex gap-2 shrink-0 flex-col">
          {isMinGreaterThanMax && (
            <div className="text-xs text-red-500 font-medium whitespace-nowrap">
              Min cannot be greater than max
            </div>
          )}
          <div className="flex gap-2">
            <Button
              onClick={handleSaveRule}
              disabled={isSaveRuleDisabled}
              className={`px-8 py-6 text-sm ${isSaveRuleDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-theme-dark-green hover:bg-theme-dark-green/90 text-white"
                }`}
            >
              {isEditing ? "Update" : "Save"}
            </Button>
            {isEditing && (
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className="px-6 py-6 text-sm"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default function RewardRulesSection({
  earnMethod,
  minSpending,
  setMinSpending,
  maxSpending,
  setMaxSpending,
  rewardPercentage,
  setRewardPercentage,
  rewardRules,
  setRewardRules,
  showTable,
  setShowTable
}: Readonly<RewardRulesSectionProps>) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const targetPreviousIndex = editingIndex === null ? rewardRules.length - 1 : editingIndex - 1;
  const prevRule = targetPreviousIndex >= 0 && targetPreviousIndex < rewardRules.length ? rewardRules[targetPreviousIndex] : null;
  const expectedMin = prevRule ? (Number.parseFloat(removeCommas(prevRule.max)) + 1).toString() : null;
  const isMinEditable = !prevRule;

  useEffect(() => {
    if (expectedMin !== null && removeCommas(minSpending) !== expectedMin) {
      setMinSpending(formatNumberWithCommas(expectedMin));
    }
  }, [expectedMin, minSpending, setMinSpending]);

  const handleSaveRule = () => {
    if (!minSpending || !maxSpending || !rewardPercentage) return;

    const minValue = Number.parseFloat(removeCommas(minSpending));
    const maxValue = Number.parseFloat(removeCommas(maxSpending));

    if (minValue > maxValue) return;

    const newRule = {
      min: removeCommas(minSpending),
      max: removeCommas(maxSpending),
      percentage: rewardPercentage
    };

    if (editingIndex !== null) {
      const updatedRules = [...rewardRules];
      updatedRules[editingIndex] = newRule;
      const adjustedRules = adjustSubsequentRules(updatedRules, editingIndex + 1);
      setRewardRules(adjustedRules);
      setEditingIndex(null);
    } else {
      setRewardRules([...rewardRules, newRule]);
    }

    setMaxSpending("");
    setRewardPercentage("");
    setShowTable(true);
  };

  const handleEditRule = (index: number) => {
    const rule = rewardRules[index];
    setMinSpending(formatNumberWithCommas(rule.min));
    setMaxSpending(formatNumberWithCommas(rule.max));
    setRewardPercentage(rule.percentage);
    setEditingIndex(index);
  };

  const handleDeleteRule = (index: number) => {
    const updatedRules = rewardRules.filter((_, i) => i !== index);
    const adjustedRules = adjustSubsequentRules(updatedRules, index);

    setRewardRules(adjustedRules);
    if (adjustedRules.length === 0) {
      setShowTable(false);
      setMinSpending("");
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    if (rewardRules.length === 0) setMinSpending("");
    setMaxSpending("");
    setRewardPercentage("");
  };

  const minValue = minSpending ? Number.parseFloat(removeCommas(minSpending)) : null;
  const maxValue = maxSpending ? Number.parseFloat(removeCommas(maxSpending)) : null;
  const isMinGreaterThanMax = minValue !== null && maxValue !== null && minValue > maxValue;
  const isSaveRuleDisabled = !minSpending || !maxSpending || !rewardPercentage || isMinGreaterThanMax;

  return (
    <div className="space-y-4">
      <label htmlFor="reward-rules" className="text-sm font-semibold text-gray-900">
        Reward Rules <span className="text-red-500">*</span>
      </label>

      {showTable && rewardRules.length > 0 && (
        <RulesTable
          rewardRules={rewardRules as RewardRuleItem[]}
          earnMethod={earnMethod}
          onEdit={handleEditRule}
          onDelete={handleDeleteRule}
        />
      )}

      <RulesInput
        earnMethod={earnMethod}
        minSpending={minSpending}
        setMinSpending={setMinSpending}
        maxSpending={maxSpending}
        setMaxSpending={setMaxSpending}
        rewardPercentage={rewardPercentage}
        setRewardPercentage={setRewardPercentage}
        isMinEditable={isMinEditable}
        isMinGreaterThanMax={isMinGreaterThanMax}
        isSaveRuleDisabled={isSaveRuleDisabled}
        handleSaveRule={handleSaveRule}
        handleCancelEdit={handleCancelEdit}
        isEditing={editingIndex !== null}
      />
    </div>
  );
}
