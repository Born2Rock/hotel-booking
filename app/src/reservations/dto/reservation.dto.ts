export type ReservationDto = {
  dateStart: string | Date;
  dateEnd: string | Date;
  hotelRoom: {
    description: string;
    images: any[];
  };
  hotel: {
    title: string;
    description: string;
  };
};
