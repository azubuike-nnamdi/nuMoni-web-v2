"use client";

import { RewardIcon } from "@/components/common/icon-svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatNumber, formatNumberWithCommas, isNumericOnly, removeCommas } from "@/lib/helper";
import { RewardRulesSectionProps } from "@/lib/types";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";

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
}: RewardRulesSectionProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const handleSaveRule = () => {
    if (minSpending && maxSpending && rewardPercentage) {
      const minValue = parseFloat(removeCommas(minSpending));
      const maxValue = parseFloat(removeCommas(maxSpending));

      // Validate that min is not greater than max
      if (minValue > maxValue) {
        return; // Don't save if min > max
      }

      const newRule = {
        min: removeCommas(minSpending),
        max: removeCommas(maxSpending),
        percentage: rewardPercentage
      };

      if (editingIndex !== null) {
        // Update existing rule
        const updatedRules = [...rewardRules];
        updatedRules[editingIndex] = newRule;
        setRewardRules(updatedRules);
        setEditingIndex(null);
      } else {
        // Add new rule
        setRewardRules([...rewardRules, newRule]);
      }

      setMinSpending("");
      setMaxSpending("");
      setRewardPercentage("");
      setShowTable(true);
    }
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
    setRewardRules(updatedRules);
    if (updatedRules.length === 0) {
      setShowTable(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setMinSpending("");
    setMaxSpending("");
    setRewardPercentage("");
  };

  // Check if min > max
  const minValue = minSpending ? parseFloat(removeCommas(minSpending)) : null;
  const maxValue = maxSpending ? parseFloat(removeCommas(maxSpending)) : null;
  const isMinGreaterThanMax = minValue !== null && maxValue !== null && minValue > maxValue;

  const isSaveRuleDisabled = !minSpending || !maxSpending || !rewardPercentage || isMinGreaterThanMax;

  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-gray-900">
        Reward Rules <span className="text-red-500">*</span>
      </label>

      {/* Rules Table */}
      {showTable && rewardRules.length > 0 && (
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
                <div key={index} className={`grid grid-cols-4 text-sm text-gray-900 ${index !== rewardRules.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  <div className="px-3 lg:px-4 py-3 text-left">{formatNumber(rule.min)}</div>
                  <div className="px-3 lg:px-4 py-3 text-center">{formatNumber(rule.max)}</div>
                  <div className="px-3 lg:px-4 py-3 text-right">
                    {rule.percentage}{earnMethod === "percentage" ? "%" : ""}
                  </div>
                  <div className="px-3 lg:px-4 py-3 text-center flex items-center justify-center gap-1 lg:gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRule(index)}
                      className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-gray-200"
                    >
                      <Edit className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-gray-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRule(index)}
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
              <div key={index} className={`p-3 ${index !== rewardRules.length - 1 ? 'border-b border-gray-200' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-theme-dark-green">Rule {index + 1}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRule(index)}
                      className="h-7 w-7 p-0 hover:bg-gray-200 rounded-full"
                    >
                      <Edit className="h-3.5 w-3.5 text-gray-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRule(index)}
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
      )}

      {/* Input Fields */}
      <div className="space-y-4 sm:space-y-0">
        {/* Mobile Layout */}
        <div className="sm:hidden space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Min Spending</label>
              <Input
                type="text"
                placeholder="Min"
                value={minSpending}
                onChange={(e) => {
                  const value = e.target.value;
                  if (isNumericOnly(value)) {
                    setMinSpending(formatNumberWithCommas(value));
                  }
                }}
                className="w-full px-3 py-3 focus:outline-none focus:ring-0 focus:border-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Max Spending</label>
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
                  if (isNumericOnly(value)) {
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
              {editingIndex !== null ? "Update" : "Save"}
            </Button>
            {editingIndex !== null && (
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
              const value = e.target.value;
              if (isNumericOnly(value)) {
                setMinSpending(formatNumberWithCommas(value));
              }
            }}
            className="flex-1 min-w-0 px-3 py-6 focus:outline-none focus:ring-0 focus:border-none"
          />
          <span className="text-gray-500 flex-shrink-0">-</span>
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
          <span className="text-gray-500 flex-shrink-0">=</span>
          <div className="flex-1 min-w-0 relative">
            <Input
              type="text"
              placeholder="0"
              value={rewardPercentage}
              onChange={(e) => {
                const value = e.target.value;
                if (isNumericOnly(value)) {
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
          <span className="text-gray-500 flex-shrink-0">-</span>
          <div className="flex gap-2 flex-shrink-0 flex-col">
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
                {editingIndex !== null ? "Update" : "Save"}
              </Button>
              {editingIndex !== null && (
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
    </div>
  );
}
