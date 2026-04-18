package com.manohar.Doctor.appointment.Book.Application.dto.payment;


import lombok.AllArgsConstructor;
//<parameter name="file_text">package com.manohar.Doctor.appointment.Book.Application.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderResponse {

    private String orderId;              // Razorpay order ID (prefix: order_)
    private BigDecimal amount;           // amount in INR
    private String currency;             // "INR"
    private String razorpayKeyId;        // public key sent to frontend to open checkout
    private Long appointmentId;
    private String doctorName;
    private String patientName;
}
