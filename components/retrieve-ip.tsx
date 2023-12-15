"use client";

import { useEffect, useState } from "react";
import TypewriterEffect from "./typewriter";

interface IPData {
  ip: string;
  city: string;
  country_name: string;
}

export default function RetrieveIP() {
  const [data, setData] = useState<IPData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://ipapi.co/json");
        const json = await res.json();
        setData(json as IPData);
      } catch (error) {
        console.error("Error fetching IP data:", error);
        setData(null);
      }
    };

    fetchData();
  }, []);

  return data ? (
    <TypewriterEffect
      string={`Welcome back ${data.ip}, it's good to see someone from ${data.city}, ${data.country_name}!`}
    />
  ) : null;
}
