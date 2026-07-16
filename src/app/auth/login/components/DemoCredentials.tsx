"use client";

import React from "react";

export default function DemoCredentials() {
  return (
    <div className="w-full bg-neutral-900/40 border border-zinc-900 rounded-xl p-4 text-[10px] text-gray-500 font-mono space-y-2">
      <div className="text-gray-400 font-semibold tracking-wider uppercase">
        Demo Operator Credentials:
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <span className="text-red-500/80">Manager:</span>
          <br />
          ID: manager (MGR-001)
          <br />
          Key: manager123
        </div>
        <div>
          <span className="text-red-500/80">Procurement:</span>
          <br />
          ID: procurement (EMP-781)
          <br />
          Key: nopal23
        </div>
        <div>
          <span className="text-red-500/80">Engineer:</span>
          <br />
          ID: engineer (EMP-672)
          <br />
          Key: qwerty123
        </div>
      </div>
    </div>
  );
}
