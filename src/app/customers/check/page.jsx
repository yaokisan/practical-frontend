"use client";

import OneCustomerInfoCard from "@/app/components/one_customer_info_card.jsx";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

// データ取得と表示ロジックをこのコンポーネントに分離
function CheckCustomer() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [customerInfo, setCustomerInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // この関数はコンポーネント内部に移動
  async function fetchCustomer(id) {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_ENDPOINT + `/customers?customer_id=${id}`
    );
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch customer");
    }
    const data = await res.json();
    return data && data.length > 0 ? data[0] : null;
  }

  useEffect(() => {
    if (id) {
      fetchCustomer(id)
        .then(setCustomerInfo)
        .catch((err) => {
          console.error(err);
          setError("顧客情報の取得に失敗しました。");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!customerInfo) return <div className="alert alert-warning">指定された顧客は見つかりません。</div>;

  return (
    <>
      <div className="alert alert-success">更新しました</div>
      <div className="card bordered bg-white border-blue-200 border-2 max-w-sm m-4">
        <OneCustomerInfoCard {...customerInfo} />
      </div>
      <button className="btn btn-outline btn-accent">
        <a href="/customers">一覧に戻る</a>
      </button>
    </>
  );
}

// デフォルトエクスポートするページコンポーネント
export default function CheckPage() {
  return (
    // Suspenseでラップする
    <Suspense fallback={<div>Loading...</div>}>
      <CheckCustomer />
    </Suspense>
  );
}
