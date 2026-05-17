import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  jsonb,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const clinics = pgTable("clinics", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  specialty: text("specialty"),
  vapiAssistantId: text("vapi_assistant_id"),
  vapiPhoneNumberId: text("vapi_phone_number_id"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const doctors = pgTable("doctors", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  title: text("title"),
  specialty: text("specialty"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").default(true).notNull(),
  displayOrder: integer("display_order").default(0),
});

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").default(30).notNull(),
  priceFrom: integer("price_from"),
  priceTo: integer("price_to"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "cascade" }),
    patientName: text("patient_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    tcNo: text("tc_no"),
    dateOfBirth: timestamp("date_of_birth"),

    doctorId: uuid("doctor_id").references(() => doctors.id),
    serviceId: uuid("service_id").references(() => services.id),
    appointmentAt: timestamp("appointment_at").notNull(),
    durationMinutes: integer("duration_minutes").default(30).notNull(),

    status: text("status", {
      enum: ["talep", "onaylandi", "tamamlandi", "iptal", "gelmedi"],
    })
      .default("talep")
      .notNull(),
    source: text("source", {
      enum: ["web", "voice_agent", "whatsapp", "telefon", "yuzyuze"],
    }).notNull(),

    complaint: text("complaint"),
    internalNotes: text("internal_notes"),
    cancelReason: text("cancel_reason"),

    reminderSentAt: timestamp("reminder_sent_at"),
    secondReminderSentAt: timestamp("second_reminder_sent_at"),
    confirmedAt: timestamp("confirmed_at"),
    reviewRequestedAt: timestamp("review_requested_at"),

    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    dateIdx: index("appointments_date_idx").on(t.appointmentAt),
    statusIdx: index("appointments_status_idx").on(t.status),
    phoneIdx: index("appointments_phone_idx").on(t.phone),
    clinicIdx: index("appointments_clinic_idx").on(t.clinicId),
  })
);

export const voiceCalls = pgTable("voice_calls", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "cascade" }),
  externalCallId: text("external_call_id").unique(),
  phone: text("phone").notNull(),
  direction: text("direction", { enum: ["inbound", "outbound"] }).notNull(),
  durationSeconds: integer("duration_seconds"),
  transcript: text("transcript"),
  summary: text("summary"),
  outcome: text("outcome", {
    enum: [
      "randevu_alindi",
      "bilgi_verildi",
      "insan_aktarimi",
      "cevapsiz",
      "spam",
      "hata",
    ],
  }),
  appointmentId: uuid("appointment_id").references(() => appointments.id),
  recordingUrl: text("recording_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const recallExclusions = pgTable("recall_exclusions", {
  phone: text("phone").primaryKey(),
  clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "cascade" }),
  reason: text("reason"),
  excludedAt: timestamp("excluded_at").defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "cascade" }),
  plan: text("plan", { enum: ["baslangic", "profesyonel", "kurumsal"] }).notNull(),
  status: text("status", { enum: ["pending", "trial", "active", "cancelled", "expired"] }).default("pending").notNull(),
  iyzicoSubscriptionRef: text("iyzico_subscription_ref"),
  iyzicoCustomerRef: text("iyzico_customer_ref"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  clinic: one(clinics, { fields: [subscriptions.clinicId], references: [clinics.id] }),
}));

export const clinicsRelations = relations(clinics, ({ many }) => ({
  doctors: many(doctors),
  services: many(services),
  appointments: many(appointments),
  voiceCalls: many(voiceCalls),
  subscriptions: many(subscriptions),
}));

export const doctorsRelations = relations(doctors, ({ one }) => ({
  clinic: one(clinics, { fields: [doctors.clinicId], references: [clinics.id] }),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  clinic: one(clinics, { fields: [services.clinicId], references: [clinics.id] }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  clinic: one(clinics, { fields: [appointments.clinicId], references: [clinics.id] }),
  doctor: one(doctors, { fields: [appointments.doctorId], references: [doctors.id] }),
  service: one(services, { fields: [appointments.serviceId], references: [services.id] }),
}));

export const voiceCallsRelations = relations(voiceCalls, ({ one }) => ({
  clinic: one(clinics, { fields: [voiceCalls.clinicId], references: [clinics.id] }),
  appointment: one(appointments, { fields: [voiceCalls.appointmentId], references: [appointments.id] }),
}));
