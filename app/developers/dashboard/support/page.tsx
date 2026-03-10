import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I update my profile?",
    answer:
      "Navigate to the Resources page and select 'Update Application'. From there you can edit your headline, skills, links, availability, and rate preferences. Changes are reflected on your public marketplace profile after a brief review.",
  },
  {
    question: "How does the matching process work?",
    answer:
      "Companies browse the developer marketplace and express interest in candidates whose skills match their requirements. When a company selects your profile, you will receive a structured brief with role details. You can then accept or decline the introduction. If both sides agree to proceed, an interview is scheduled.",
  },
  {
    question: "When do I get paid?",
    answer:
      "Payments are processed on a bi-weekly cycle. After your tracked hours are approved by the client, funds are released within 5 business days to your connected payment method. You can view payment history and upcoming payouts on the Earnings page.",
  },
  {
    question: "How do I track my hours?",
    answer:
      "Use the Engagements page in your dashboard to log hours against active placements. You can enter time daily or weekly. Submitted hours are sent to the client for approval. Approved hours appear on your Earnings page and are included in the next payment cycle.",
  },
  {
    question: "Can I work with multiple companies?",
    answer:
      "Yes. You can accept engagements with multiple companies simultaneously as long as your total committed hours do not exceed your stated availability. Keep your availability status accurate so new opportunities align with your actual capacity.",
  },
] as const;

export default async function SupportPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="size-8">
              <Link href="/developers/dashboard/resources">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <CardTitle>Support</CardTitle>
              <CardDescription>
                Find answers to common questions or reach out to the OctogleHire
                team directly.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader className="pb-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Contact
          </p>
          <CardTitle className="text-base">Get in Touch</CardTitle>
          <CardDescription>
            Have a question not covered below? Email our support team and we will
            get back to you within one business day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Mail className="size-4 text-pulse" />
            <a
              href="mailto:support@octoglehire.com"
              className="text-sm font-medium underline underline-offset-4"
            >
              support@octoglehire.com
            </a>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader className="pb-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            FAQ
          </p>
          <CardTitle className="text-base">
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-sm font-medium text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
}
