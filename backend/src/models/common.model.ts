import { ApiProperty } from "@nestjs/swagger";

export class DeleteResponse {
    @ApiProperty({
        example: 'Room deleted successfully',
        required: true,
    })
    message: string;
}