"use client";
import OneCustomerInfoCard from "@/app/components/one_customer_info_card.jsx";
import fetchCustomer from "./fetchCustomer";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function Confirm() {
  const router = useRouter();
  const customer_id = useSearchParams().get("customer_id");
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (customer_id) {
      const fetchAndSetCustomer = async () => {
        const customerData = await fetchCustomer(customer_id);
        setCustomer(customerData);
      };
      fetchAndSetCustomer();
    }
  }, [customer_id]);

  if (!customer) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="card bordered bg-white border-blue-200 border-2 max-w-sm m-4">
      <div className="alert alert-success p-4 text-center">
        正常に作成しました
      </div>
      <OneCustomerInfoCard {...customer} />
      <button onClick={() => router.push("/customers")}>
        <div className="btn btn-primary m-4 text-2xl">戻る</div>
      </button>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Confirm />
    </Suspense>
  );
}
