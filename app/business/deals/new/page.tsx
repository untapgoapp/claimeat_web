import { BusinessCreateDealForm } from "@/components/business/create/business-create-deal-form";

export default function NewBusinessDealPage() {
  return (
    <div className="business-form-page">
        <div className="business-form-page__intro">
          <p>Create a rescue offer</p>

          <h1>New deal</h1>

          <span>
            Choose a store, set the collection window and publish the food
            available today.
          </span>
        </div>

        <BusinessCreateDealForm />
      </div>
  );
}
