import { ApiProperty } from '@nestjs/swagger';

export class UploadFileRequest {

  
  @ApiProperty({
    example: 'john_doe',
    description: 'Username of the person uploading the file',
    required: true,
  })
  username: string;

  @ApiProperty({
    example: 'profile_picture',
    description: 'Purpose of the uploaded file',
    required: true,
  })
  forWhat: string;
}

export class FileResponseDto {
  @ApiProperty({
    example: 'file_uploaded_successfully',
    description: 'Status message indicating the result of the operation',
  })
  message: string;
}
