"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Lock, ShoppingBag } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";

import type {
  PaymentMethod,
  ShippingInfo,
} from "@/types/order";

export default function CheckoutForm() {
  const router = useRouter();

  const { cartItems, cartTotal, clearCart } = useCart();
  const { createOrder } = useOrder();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [shipping, setShipping] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Bangladesh",
  });

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cod");

  const shippingCost = cartTotal >= 100 ? 0 : 9.99;
  const tax = cartTotal * 0.05;
  const total = cartTotal + shippingCost + tax;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setShipping((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields: Array<keyof ShippingInfo> = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "postalCode",
    ];

    for (const field of requiredFields) {
      if (!shipping[field].trim()) {
        return "Please fill in all required fields.";
      }
    }

    if (!shipping.email.includes("@")) {
      return "Please enter a valid email address.";
    }

    if (shipping.phone.length < 8) {
      return "Please enter a valid phone number.";
    }

    return "";
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const order = createOrder({
        items: cartItems,
        shipping,
        paymentMethod,
        subtotal: cartTotal,
        shippingCost,
        tax,
        total,
      });

      clearCart();

      router.replace(`/order-success?orderId=${order.id}`);
    } catch (submitError) {
      console.error(submitError);
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-8 lg:grid-cols-[1fr_380px]"
    >
      <div className="space-y-6">
        <div className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-2 text-blue-600 dark:bg-blue-950">
              <ShoppingBag size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Shipping Information
              </h2>

              <p className="text-sm text-zinc-500">
                Where should we deliver your order?
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="First Name"
              name="firstName"
              value={shipping.firstName}
              onChange={handleChange}
              placeholder="John"
            />

            <InputField
              label="Last Name"
              name="lastName"
              value={shipping.lastName}
              onChange={handleChange}
              placeholder="Doe"
            />

            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={shipping.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />

            <InputField
              label="Phone Number"
              name="phone"
              value={shipping.phone}
              onChange={handleChange}
              placeholder="+880 1XXXXXXXXX"
            />

            <div className="sm:col-span-2">
              <InputField
                label="Street Address"
                name="address"
                value={shipping.address}
                onChange={handleChange}
                placeholder="House number, street name"
              />
            </div>

            <InputField
              label="City"
              name="city"
              value={shipping.city}
              onChange={handleChange}
              placeholder="Dhaka"
            />

            <InputField
              label="Postal Code"
              name="postalCode"
              value={shipping.postalCode}
              onChange={handleChange}
              placeholder="1200"
            />

            <InputField
              label="Country"
              name="country"
              value={shipping.country}
              onChange={handleChange}
              placeholder="Bangladesh"
            />
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-7">
          <h2 className="mb-5 text-lg font-bold">
            Payment Method
          </h2>

          <div className="space-y-3">
            <PaymentOption
              value="cod"
              selected={paymentMethod}
              onChange={setPaymentMethod}
              title="Cash on Delivery"
              description="Pay when your order arrives"
            />

            <PaymentOption
              value="card"
              selected={paymentMethod}
              onChange={setPaymentMethod}
              title="Credit / Debit Card"
              description="Demo payment option"
            />

            <PaymentOption
              value="mobile-banking"
              selected={paymentMethod}
              onChange={setPaymentMethod}
              title="Mobile Banking"
              description="bKash, Nagad or Rocket — demo option"
            />
          </div>

          <div className="mt-5 flex gap-2 rounded-xl bg-zinc-50 p-3 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            <Lock size={17} className="mt-0.5 shrink-0" />

            <p>
              This is a demo checkout. No real payment will be
              processed.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            "Placing Order..."
          ) : (
            <>
              <CheckCircle2 size={19} />
              Place Order
            </>
          )}
        </button>
      </div>

      <aside className="h-fit rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-7 lg:sticky lg:top-24">
        <h2 className="mb-5 text-lg font-bold">
          Order Summary
        </h2>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 border-b pb-4 dark:border-zinc-800"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-16 w-16 rounded-lg object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Qty: {item.quantity}
                </p>

                <p className="mt-1 text-sm font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">Shipping</span>
            <span>
              {shippingCost === 0
                ? "Free"
                : `$${shippingCost.toFixed(2)}`}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="border-t pt-4 dark:border-zinc-800">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-blue-600">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/cart"
          className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </Link>
      </aside>
    </form>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">
        {label}
      </span>

      <input
        required
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-blue-950"
      />
    </label>
  );
}

function PaymentOption({
  value,
  selected,
  onChange,
  title,
  description,
}: {
  value: PaymentMethod;
  selected: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  title: string;
  description: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
        selected === value
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
          : "border-zinc-200 hover:border-blue-300 dark:border-zinc-700"
      }`}
    >
      <input
        type="radio"
        name="paymentMethod"
        value={value}
        checked={selected === value}
        onChange={() => onChange(value)}
        className="mt-1"
      />

      <span>
        <span className="block font-medium">{title}</span>
        <span className="mt-1 block text-sm text-zinc-500">
          {description}
        </span>
      </span>
    </label>
  );
}