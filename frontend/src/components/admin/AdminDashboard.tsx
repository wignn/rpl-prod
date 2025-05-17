"use client"

import React,{ useState } from "react"
import Sidebar from "@/components/dasbord/Sidebar"
import Header from "@/components/dasbord/Header"
import DashboardContent from "./DashboardContent"
import UsersContent from "./TenantContent"
import SettingsContent from "./SettingsContent"
import FinanceDashboard from "@/components/admin/Finance"
import { UserDetailResponse } from "@/types/user"
import RoomContent from "./RoomContent"
import { FacilityDetailResponse } from "@/types/facility"
import { RoomTypeResponse } from "@/types/room"
import Report from "@/components/admin/ReportContent"
import FacilityContent from "./FacilityContent"
import RecordContent from "./RecordContent"
import RoomsTypeContent from "./RoomTypeContent"

interface Props {
  accessToken: string;
  user: UserDetailResponse;
  facilities: FacilityDetailResponse[]
  roomtype: RoomTypeResponse[] 
  baseUrl: string;
  kamar: number;
  kamarKosong: number;
  kamarTerisi: number;
  pendapatan: number;
  actifity: Activity[];
}

interface Activity {
  id: string;
  message: string;
  timestamp: string;
}


export default function AdminDashboard({accessToken, baseUrl,facilities, roomtype,user, kamar, kamarKosong, kamarTerisi, pendapatan, actifity, }: Props) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  return (
    <div className="flex h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} showUserDropdown={showUserDropdown} setShowUserDropdown={setShowUserDropdown} />

        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "dashboard" && <DashboardContent accessToken={accessToken} kamar={kamar} kamarKosong={kamarKosong} kamarTerisi={kamarTerisi} pendapatan={pendapatan} actifity={actifity}/>}
          {activeTab === "rooms" && <RoomsTypeContent facilities={facilities} baseUrl={baseUrl as string} accessToken={accessToken}/>}
          {activeTab === "users" && <UsersContent accessToken={accessToken}/>}
          {activeTab === "roomList" && <RoomContent roomtypes={roomtype} accessToken={accessToken}/>}
          {activeTab === "transactions" && <FinanceDashboard accessToken={accessToken}/>}
          {activeTab === "reports" && <Report accessToken={accessToken}/>}
          {activeTab === "settings" && <SettingsContent />}
          {activeTab === "facilities" && <FacilityContent accessToken={accessToken}/>}
          {activeTab === "records" && <RecordContent accessToken={accessToken}/>}
        </main>
      </div>
    </div>
  )
}

