'use client';

import { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, where, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProductReview, ReviewType } from '@/types';

export interface SubmitReviewInput {
  authorName: string;
  rating: number;
  text: string;
  type: ReviewType;
  productId?: string;
  productSlug?: string;
}

export async function submitReview(input: SubmitReviewInput): Promise<void> {
  await addDoc(collection(db, 'reviews'), {
    authorName: input.authorName,
    rating: input.rating,
    text: input.text,
    type: input.type,
    productId: input.productId ?? null,
    productSlug: input.productSlug ?? null,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
}

export function useApprovedProductReviews(productSlug: string) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('productSlug', '==', productSlug),
      where('status', '==', 'approved')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const approved = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data() as Omit<ProductReview, 'id'>;
            return { ...data, id: docSnap.id };
          })
          .filter((review) => review.type === 'general')
          .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

        setReviews(approved);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, [productSlug]);

  return { reviews, loading };
}

export interface SiteReview {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  createdAt: string;
  type: ReviewType;
}

export function useApprovedReviews() {
  const [reviews, setReviews] = useState<SiteReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), where('status', '==', 'approved'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const approved = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data() as Partial<ProductReview> & { id?: string };
            return {
              id: docSnap.id,
              authorName: data.authorName ?? 'Green Decor Customer',
              rating: data.rating ?? 5,
              text: data.text ?? '',
              createdAt: data.createdAt ?? '',
              type: (data.type ?? 'general') as ReviewType,
            };
          })
          .filter((review) => review.type === 'general' && review.text.trim().length > 0)
          .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

        setReviews(approved);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, []);

  return { reviews, loading };
}
