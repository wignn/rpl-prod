import PropertyDetail from "@/components/guest/roomType";
import { apiRequest } from "@/lib/api";
import type { RoomTypeResponse } from "@/types/room";
import { notFound } from "next/navigation";
import Header from "@/components/Home/Navbar";

/**
 * Renders a room type details page based on the provided ID parameter.
 * 
 * This component fetches room type data from the API using the ID from the URL parameters.
 * If the room type is not found, it triggers the Next.js notFound() functionality.
 * Otherwise, it displays the room type details using the PropertyDetail component.
 * 
 * @param {object} props - Component props
 * @param {Promise<{id: string}>} props.params - The route parameters containing the room type ID
 * @returns {JSX.Element} A page displaying the room type details with header
 * @throws {Error} If there's an issue fetching the room type data
 */

async function Page({ params }: { params: Promise<{ id: string }> }) {
  let roomType: RoomTypeResponse | null = null;
  const { id } = await params;
  const url = process.env.NEXT_PUBLIC_API_URL;

  try {
    roomType = await apiRequest<RoomTypeResponse>({
      endpoint: `/roomtype/${id}`,
      method: "GET",
    });
  } catch (error) {
    throw error;
  }

  if (!roomType) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-100 to-green-200">
      <Header tipeKamarHref="/" user={undefined} />
      <PropertyDetail roomType={roomType} url={url as string} />
    </div>
  );
}

export default Page;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let roomType: RoomTypeResponse | null = null;
  const description = `Detail Kamar ${id}`;
  try {
    roomType = await apiRequest<RoomTypeResponse>({
      endpoint: `/roomtype/${id}`,
      method: "GET",
    });
  } catch (error) {
    throw error;
  }
  return {
    title: `Detail Kamar ${roomType?.room_type}`,
    description: description,
  }
}
