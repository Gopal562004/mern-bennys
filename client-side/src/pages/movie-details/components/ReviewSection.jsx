import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

const ReviewSection = ({ reviews }) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const displayedReviews = showAllReviews ? reviews : reviews?.slice(0, 3);

  const handleSubmitReview = (e) => {
    e?.preventDefault();
    console.log("Review submitted:", { rating: userRating, text: reviewText });
    setUserRating(0);
    setReviewText("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-card rounded-lg elevation-2 p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
        <Icon name="MessageSquare" size={28} className="text-primary" />
        Reviews & Ratings
      </h2>
      {/* Submit Review Form */}
      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Share Your Review
        </h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Your Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-smooth"
                >
                  <Icon
                    name="Star"
                    size={24}
                    className={`${
                      star <= (hoverRating || userRating)
                        ? "text-warning fill-current"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
              {userRating > 0 && (
                <span className="ml-2 text-sm font-medium text-foreground">
                  {userRating}/10
                </span>
              )}
            </div>
          </div>

          <Input
            label="Your Review"
            type="text"
            placeholder="Share your thoughts about this movie..."
            value={reviewText}
            onChange={(e) => setReviewText(e?.target?.value)}
            description="Minimum 20 characters required"
          />

          <Button
            type="submit"
            variant="default"
            disabled={userRating === 0 || reviewText?.length < 20}
            iconName="Send"
            iconPosition="right"
          >
            Submit Review
          </Button>
        </form>
      </div>
      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews?.map((review) => (
          <div
            key={review?.id}
            className="border-b border-border pb-6 last:border-0"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden elevation-2">
                  <Image
                    src={review?.userAvatar}
                    alt={review?.userAvatarAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-base font-semibold text-foreground">
                      {review?.userName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(review?.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-warning/10 text-warning px-3 py-1 rounded-full">
                    <Icon name="Star" size={16} className="fill-current" />
                    <span className="text-sm font-bold">
                      {review?.rating}/10
                    </span>
                  </div>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {review?.comment}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-smooth">
                    <Icon name="ThumbsUp" size={16} />
                    <span className="text-xs">{review?.helpful}</span>
                  </button>
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-smooth">
                    <Icon name="MessageCircle" size={16} />
                    <span className="text-xs">Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {reviews?.length > 3 && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(!showAllReviews)}
            iconName={showAllReviews ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {showAllReviews
              ? "Show Less"
              : `View All ${reviews?.length} Reviews`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
