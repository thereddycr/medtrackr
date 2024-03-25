import React from 'react'

export default function DeliveryBox({ imgSrc, title }) {
  return (
    <div className="col-lg-4 col-xl-3 col-md-4 col-sm-6 col-12 delivery-box-inner text-center">
    <div className="delivery-box p-5">
      <img src={imgSrc} className="img-fluid" alt="Delivery Box Icon" />
      <h2 className="pt-3 text-center">{title}</h2>
    </div>
  </div>
  )
}
