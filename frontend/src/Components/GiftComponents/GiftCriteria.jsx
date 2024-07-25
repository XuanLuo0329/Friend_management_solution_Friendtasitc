import React from "react"

function GiftCriteria({giftPurpose, setGiftPurpose, budgetMin, setBudgetMin, budgetMax, setBudgetMax, specificRequirements, setSpecificRequirements, disabled}) {

    return (
      <div>
        <div className="mt-8">
          <label htmlFor="gift-purpose" className="block text-sm font-medium leading-6 text-gray-900">
            Gift Purpose<span className="text-red-600">*</span>
          </label>
          <div className="mt-3">
            <input
              type="text"
              name="gift-purpose"
              id="gift-purpose"
              className="required:border-red-500 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Birthday"
              required
              value={giftPurpose}
              disabled={disabled}
              onChange={event => setGiftPurpose(event.target.value)}
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="budget-min" className="block text-sm font-medium leading-6 text-gray-900">
              Min Budget<span className="text-red-600">*</span>
            </label>
            <div className="relative mt-3 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="budget-min"
                id="budget-min"
                className="block w-full rounded-md border-0 py-1.5 pl-5 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="0.00"
                min="0"
                aria-describedby="budget-currency"
                required
                value={budgetMin}
                onChange={event => setBudgetMin(event.target.value)}
                disabled={disabled}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
                <span className="text-gray-500 sm:text-xs" id="budget-currency">
                  NZD
                </span>
              </div>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="budget" className="block text-sm font-medium leading-6 text-gray-900">
              Max Budget<span className="text-red-600">*</span>
            </label>
            <div className="relative mt-3 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="budget-max"
                id="budget-max"
                className="block w-full rounded-md border-0 py-1.5 pl-5 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="0.00"
                aria-describedby="budget-currency"
                required
                value={budgetMax}
                onChange={event => setBudgetMax(event.target.value)}
                disabled={disabled}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
                <span className="text-gray-500 sm:text-xs" id="budget-currency">
                  NZD
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 col-span-full">
          <div className="flex justify-between">
            <label htmlFor="specific-requirements" className="block text-sm font-medium leading-6 text-gray-900">
              Specific Requirements
            </label>
            <span className="text-sm leading-6 text-gray-500" id="gift-purpose-optional">
              Optional
            </span>
          </div>
          <div className="mt-3">
            <textarea
              id="specific-requirements"
              name="specific-requirements"
              rows={3}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={specificRequirements}
              onChange={event => setSpecificRequirements(event.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    )
  }

export default GiftCriteria;