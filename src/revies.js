import React from "react";

function Review() {
  const reviewers = [
    {
      id: 1,
      image: "./images/hair.png", 
      user: "Aisha O",
      caption: "Super happy with the results",
      stars: "★★★★★",
      comments: "Emeka was professional, punctual, and delivered top-quality plumbing work. Booking was easy, and he went above and beyond. Highly recommend!"
    },
    {
      id: 2,
      image: "./images/blackman.png", 
      user: "Nneka E",
      caption: "Super happy with the results",
      stars: "★★★★★",
      comments: "Emeka was professional, punctual, and delivered top-quality plumbing work. Booking was easy, and he went above and beyond. Highly recommend!"
    },
    {
      id: 3,
      image: "./images/panama.png",
      user: "David K",
      caption: "Super happy with the results",
      stars: "★★★★★",
      comments: "Emeka was professional, punctual, and delivered top-quality plumbing work. Booking was easy, and he went above and beyond. Highly recommend!"
    },
    {
      id: 4,
      image: "./images/dreadhair.png", 
      user: "Olumide I",
      caption: "Super happy with the results",
      stars: "★★★★☆",
      comments: "Emeka was professional, punctual, and delivered top-quality plumbing work. Booking was easy, and he went above and beyond. Highly recommend!"
    }
  ];

  return (
    <div className="reviews-container">
      <h2 className="reviews-title">What Our Customers Say</h2>
      <div className="reviews-grid">
        {reviewers.map((reviewer) => (
          <div className="review-card" key={reviewer.id}>
            <div className="review-header">
              <img 
                className="review-image" 
                src={reviewer.image || "/placeholder-avatar.jpg"} 
                alt={`${reviewer.user} avatar`} 
              />
              <div className="review-user-info">
                <h3 className="review-user">{reviewer.user}</h3>
                <div className="review-stars">{reviewer.stars}</div>
              </div>
            </div>
            <p className="review-caption">{reviewer.caption}</p>
            <p className="review-comments">{reviewer.comments}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Review;