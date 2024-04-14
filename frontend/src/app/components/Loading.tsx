'use client'

import React from 'react'

// Loading Page
export default function Loading() {
  return (
    <div class="flex w-full min-h-full flex-wrap content-center justify-center ">
    <div class="p-4 bg-white border border-primary rounded-md">
        <div class="flex">
            <div class="mr-4 bg-gray-200 border border-gray-200 h-16 w-16 rounded animate-pulse"></div>
            <div class="space-y-1 flex flex-col w-full">
                <div class="flex w-full flex items-center">
                    <div class="bg-gray-200 border border-gray-200 w-60 h-5 animate-pulse"></div>
                    <div class="ml-4 bg-ternary w-12 h-5 animate-pulse"></div>
                </div>
                <div class="bg-gray-200 border border-gray-200 w-36 h-5 animate-pulse"></div>
                <div class="bg-gray-200 border border-gray-200 w-full h-44 animate-pulse">
                </div>
            </div>
        </div>

        <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <div class="bg-gray-200 border border-gray-200 w-16 h-5 animate-pulse"></div>
                <span class="bg-tertiary h-1 w-1 rounded animate-pulse"></span>
                <div class="bg-gray-200 border border-gray-200 w-16 h-5 animate-pulse"></div>
            </div>
            <div class="bg-gray-200 border border-gray-200 w-16 h-5 animate-pulse"></div>
        </div>
    </div>
</div>)
}