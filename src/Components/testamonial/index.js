import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
// import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import './test.css'
const TestimonialSlider = () => {
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: 'John Doe',
      testimonial:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam gravida nisi eget Praesent non nisl eu turpis dictum consequat. Nulla facilisi. Duis vitae posuere.',
    },
    {
      id: 2,
      name: 'Jane Smith',
      testimonial:
        'Praesent non nisl eu turpis dictum consequat. Nulla facilisi. Duis vitae posuere Praesent non nisl eu turpis dictum consequat. Nulla facilisi. Duis vitae posuere.',
    },
    {
      id: 3,
      name: 'Michael Johnson',
      testimonial:
        'In hac habitasse platea dictumst. Fusce ac felis ultrices, lobortis nisl vel Praesent non nisl eu turpis dictum consequat. Nulla facilisi. Duis vitae posuere.',
    },
    {
        id: 4,
        name: 'JSmith',
        testimonial:
          'Praesent non nisl eu turpis dictum consequat. Nulla facilisi. Duis vitae posuere Praesent non nisl eu turpis dictum consequat. Nulla facilisi. Duis vitae posuere.',
      },
      {
        id: 5,
        name: 'Jane Smi',
        testimonial:
          'Praesent non nisl eu turpis dictum consequat. Nulla facilisi. Duis vitae posuere Praesent non nisl eu turpis dictum consequat. Nulla facilisi. Duis vitae posuere.',
      },
    // Add more dummy testimonials as needed
  ]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % testimonials.length;
      setActiveIndex(nextIndex);
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [activeIndex, testimonials.length]);

  return (
    <div className="testimonial-slider">
      <Carousel activeIndex={activeIndex} onSelect={(index) => setActiveIndex(index)}>
        {testimonials.map((testimonial) => (
          <Carousel.Item key={testimonial.id}>
            <div className="testimonial-content">
              <div className="quote-icons">
              <i class="fas fa-quote-left"></i>
              <i class="fas fa-quote-right"></i>
              </div>
              <p>{testimonial.testimonial}</p>
              <h5>{testimonial.name}</h5>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default TestimonialSlider;
