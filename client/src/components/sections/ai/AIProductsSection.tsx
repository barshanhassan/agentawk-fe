import React, { useState } from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
}

export default function AIProductsSection() {
  const [products] = useState<Product[]>([
    {
      id: "1",
      name: "Baserow theme",
      description: "This is a baserow theme for testing",
    },
    {
      id: "2",
      name: "imoveis",
      description: "estoque de imoveis disponiveis",
    },
    {
      id: "3",
      name: "imoveis_test_jaderson",
      description: "base_imoveis",
    },
    {
      id: "4",
      name: "imveis_tutorial",
      description: "estoque de imoveis do tutorial",
    },
    {
      id: "5",
      name: "Cadastro de Veiculos Rental Car",
      description: "Cadastro de Veiculos para locação Rental Car",
    },
  ]);

  const renderProductIcon = () => {
    return (
      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-2 flex flex-col gap-1">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-orange-400 rounded-sm"></div>
          <div className="flex-1 h-2 bg-orange-400 rounded-sm"></div>
        </div>
        <div className="flex-1 bg-blue-200 dark:bg-blue-700/30 rounded-sm"></div>
        <div className="flex gap-1">
          <div className="flex-1 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-sm"></div>
          <div className="flex-1 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-sm"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
        <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-lg">
          <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </div>
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg">AI Products</CardTitle>
          <CardDescription>Organize and manage your AI Products</CardDescription>
        </div>
      </CardHeader>
      <Separator className="bg-gray-200 dark:bg-slate-800 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-6 shadow-sm bg-white dark:bg-slate-900 flex flex-col hover:shadow-md transition-shadow"
          >
            {/* Icon */}
            <div className="mb-4">{renderProductIcon()}</div>

            {/* Title */}
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-primary mb-4 flex-grow">
              {product.description}
            </p>

            {/* Manage Button */}
            <div className="flex justify-end mt-auto pt-4">
              <button className="px-4 py-1.5 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-md text-sm font-medium transition-colors">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
