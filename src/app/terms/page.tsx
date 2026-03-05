import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Be-Inc",
  description: "Be-Inc Terms of Service for Microsoft Office Add-ins and Teams Bot",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-gray-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-serif-display text-xl text-[#5B2D8C] no-underline">
              Be-Inc
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-sm text-[#6b7280] hover:text-[#5B2D8C] transition-colors">
                Privacy Policy
              </Link>
              <Link
                href="/auth/signin"
                className="text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #5B2D8C 0%, #6366d6 100%)" }}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8 sm:p-12">
          {/* Header */}
          <h1 className="font-serif-display text-3xl text-[#1a1a2e] mb-2">Terms of Service</h1>
          <div className="w-16 h-1 bg-[#5B2D8C] rounded-full mb-6" />
          <p className="text-sm text-[#9ca3af] mb-2"><strong>Effective Date:</strong> January 6, 2026</p>
          <p className="text-sm text-[#9ca3af] mb-8"><strong>Last Updated:</strong> March 5, 2026</p>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-8">
            <p className="text-sm text-amber-900 font-medium">
              <strong>Important Notice:</strong> Please read these Terms of Service carefully before using the Be-Inc Office Add-ins, Teams Bot, or Analytics Dashboard. By installing, accessing, or using our services, you agree to be bound by these terms. If you do not agree to these terms, do not use our services.
            </p>
          </div>

          {/* Section 1 */}
          <Section number="1" title="Service Description">
            <p className="text-[#4a5568] mb-4">
              Be-Inc provides Microsoft Office Add-ins, a Teams Bot, and an Analytics Dashboard (the &quot;Services&quot;) that offer AI-powered diversity, equity, and inclusion (DE&I) compliance checking. Our Services include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
              <li><strong className="text-[#5B2D8C]">Word Add-in:</strong> Real-time document analysis for DE&I compliance with auto-detection, auto-correction, coaching, and history tracking</li>
              <li><strong className="text-[#5B2D8C]">Outlook Add-in:</strong> Email composition analysis for inclusive language with manual and automated suggestions</li>
              <li><strong className="text-[#5B2D8C]">Teams Bot:</strong> Automated channel message monitoring that flags non-inclusive language for compliance reporting. Full messages are never stored &mdash; only flagged words</li>
              <li><strong className="text-[#5B2D8C]">Analytics Dashboard:</strong> Web-based dashboard for viewing DE&I compliance trends, flagged word analytics, and team-level reports</li>
            </ul>
            <p className="text-[#4a5568] mt-4">
              The Services use artificial intelligence technology powered by Azure OpenAI to analyze text content and provide suggestions for more inclusive language.
            </p>
          </Section>

          {/* Section 2 */}
          <Section number="2" title="Acceptance of Terms">
            <p className="text-[#4a5568] mb-4">By accessing or using the Be-Inc Services, you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) agree to:</p>
            <ol className="list-decimal pl-6 space-y-2 text-[#4a5568]">
              <li>Comply with these Terms of Service</li>
              <li>Comply with all applicable local, state, national, and international laws and regulations</li>
              <li>Accept responsibility for all activities conducted through your account</li>
              <li>Be at least 18 years of age or have parental/guardian consent to use the Services</li>
            </ol>
          </Section>

          {/* Section 3 */}
          <Section number="3" title="License and Usage Rights">
            <SubSection title="3.1 License Grant">
              <p className="text-[#4a5568] mb-3">Subject to your compliance with these Terms, Be-Inc grants you a limited, non-exclusive, non-transferable, revocable license to:</p>
              <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
                <li>Install and use the Be-Inc Office Add-ins on devices you own or control</li>
                <li>Install the Be-Inc Teams Bot in teams and channels you have permission to manage</li>
                <li>Access the Be-Inc Analytics Dashboard with your authenticated account</li>
                <li>Use the Services for your personal or internal business use</li>
              </ul>
            </SubSection>

            <SubSection title="3.2 Restrictions">
              <p className="text-[#4a5568] mb-3">You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
                <li>Reverse engineer, decompile, disassemble, or attempt to derive the source code</li>
                <li>Modify, adapt, translate, or create derivative works based on the Services</li>
                <li>Remove or obscure any proprietary notices from the Services</li>
                <li>Use the Services for any illegal, harmful, or abusive purpose</li>
                <li>Circumvent any security features or usage limits</li>
                <li>Resell, sublicense, rent, lease, or distribute the Services to third parties</li>
                <li>Attempt to access other users&apos; data or accounts without authorization</li>
                <li>Use the Teams Bot data to identify, profile, or target individual employees</li>
              </ul>
            </SubSection>
          </Section>

          {/* Section 4 */}
          <Section number="4" title="User Obligations">
            <SubSection title="4.1 Account Security">
              <p className="text-[#4a5568]">
                You are responsible for maintaining the security of your Microsoft 365 account credentials, Be-Inc Dashboard credentials, and all activities that occur under your accounts.
              </p>
            </SubSection>

            <SubSection title="4.2 Content Responsibility">
              <p className="text-[#4a5568] mb-3">You retain all rights to your content (emails, documents, messages). You are solely responsible for:</p>
              <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
                <li>The accuracy, legality, and appropriateness of your content</li>
                <li>Ensuring you have the right to submit content for analysis</li>
                <li>Any consequences resulting from your content or use of the Services</li>
              </ul>
            </SubSection>

            <SubSection title="4.3 Teams Bot Installation">
              <p className="text-[#4a5568]">
                By installing the Teams Bot in a team or channel, you represent that you have the authority to do so and that you have informed team members that their messages will be analyzed for DE&I compliance. The bot operates silently and does not store full messages.
              </p>
            </SubSection>
          </Section>

          {/* Section 5 */}
          <Section number="5" title="Service Availability">
            <p className="text-[#4a5568] mb-3">Be-Inc strives to provide reliable Services but does not guarantee:</p>
            <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
              <li>Uninterrupted or error-free operation</li>
              <li>That the Services will be available at all times</li>
              <li>That all features will work on all devices or platforms</li>
              <li>Specific uptime percentages or service level agreements (unless separately agreed)</li>
            </ul>
            <p className="text-[#4a5568] mt-3">We reserve the right to modify, suspend, or discontinue the Services at any time.</p>
          </Section>

          {/* Section 6 */}
          <Section number="6" title="Privacy and Data Usage">
            <p className="text-[#4a5568] mb-3">
              Your use of the Services is subject to our <Link href="/privacy" className="text-[#5B2D8C] underline">Privacy Policy</Link>. Key points:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
              <li><strong className="text-[#5B2D8C]">AI Processing:</strong> Your content is sent to Azure OpenAI for AI-powered DE&I analysis</li>
              <li><strong className="text-[#5B2D8C]">No Message Storage:</strong> The Teams Bot does NOT store full messages &mdash; only flagged words</li>
              <li><strong className="text-[#5B2D8C]">Hashed Identities:</strong> User identities in Teams are hashed and cannot be reversed</li>
              <li><strong className="text-[#5B2D8C]">Dashboard Data:</strong> Analytics are based on aggregated flagged word data, not message content</li>
            </ul>
          </Section>

          {/* Section 7 */}
          <Section number="7" title="AI-Generated Content and Accuracy">
            <SubSection title="7.1 No Guarantee of Accuracy">
              <p className="text-[#4a5568] mb-3">
                The Services use AI to analyze content and provide suggestions. <strong>AI-generated suggestions may not always be accurate, appropriate, or complete.</strong> You acknowledge that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
                <li>AI analysis may contain errors, biases, or inaccuracies</li>
                <li>Suggestions are recommendations, not absolute requirements</li>
                <li>You are solely responsible for reviewing and deciding whether to accept suggestions</li>
                <li>The Services do not replace professional editorial, legal, or compliance review</li>
              </ul>
            </SubSection>

            <SubSection title="7.2 DE&I Compliance">
              <p className="text-[#4a5568]">
                While the Services aim to improve DE&I compliance, <strong>they do not guarantee full compliance</strong> with any specific laws, regulations, or organizational policies. The Services are a tool to assist, not a substitute for human judgment.
              </p>
            </SubSection>
          </Section>

          {/* Section 8 */}
          <Section number="8" title="Disclaimers and Warranties">
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <p className="text-sm text-[#4a5568] uppercase font-medium">
                THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
            </div>
          </Section>

          {/* Section 9 */}
          <Section number="9" title="Limitation of Liability">
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-3">
              <p className="text-sm text-[#4a5568] uppercase font-medium">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, BE-INC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR USE.
              </p>
              <p className="text-sm text-[#4a5568] uppercase font-medium">
                OUR TOTAL LIABILITY SHALL NOT EXCEED THE GREATER OF THE AMOUNT YOU PAID TO BE-INC IN THE 12 MONTHS PRECEDING THE CLAIM, OR $100 USD.
              </p>
            </div>
          </Section>

          {/* Section 10 */}
          <Section number="10" title="Indemnification">
            <p className="text-[#4a5568]">
              You agree to indemnify and hold harmless Be-Inc, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorney&apos;s fees) arising from your use of the Services, your content, or your violation of these Terms.
            </p>
          </Section>

          {/* Section 11 */}
          <Section number="11" title="Termination">
            <p className="text-[#4a5568]">
              You may stop using the Services at any time by uninstalling the add-ins, removing the Teams Bot, or deleting your dashboard account. We reserve the right to suspend or terminate your access at any time, with or without cause.
            </p>
          </Section>

          {/* Section 12 */}
          <Section number="12" title="Governing Law">
            <p className="text-[#4a5568]">
              These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
            </p>
          </Section>

          {/* Section 13 */}
          <Section number="13" title="Changes to Terms">
            <p className="text-[#4a5568]">
              We may update these Terms from time to time. Your continued use of the Services after changes become effective constitutes acceptance of the updated Terms.
            </p>
          </Section>

          {/* Section 14 */}
          <Section number="14" title="Contact Information">
            <div className="bg-[#F5F3FF] p-6 rounded-xl">
              <p className="text-[#4a5568] font-bold mb-3">Be-Inc</p>
              <p className="text-[#4a5568]"><strong className="text-[#5B2D8C]">Email:</strong> <a href="mailto:support@be-inc.ai" className="text-[#5B2D8C] underline">support@be-inc.ai</a></p>
              <p className="text-[#4a5568]"><strong className="text-[#5B2D8C]">Website:</strong> <a href="https://be-inc.ai" className="text-[#5B2D8C] underline">https://be-inc.ai</a></p>
              <p className="text-[#4a5568]"><strong className="text-[#5B2D8C]">Dashboard:</strong> <a href="https://dashboard.be-inc.ai" className="text-[#5B2D8C] underline">https://dashboard.be-inc.ai</a></p>
            </div>
          </Section>

          {/* Section 15 */}
          <Section number="15" title="Acknowledgment">
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <p className="text-sm text-[#4a5568] uppercase font-medium">
                BY INSTALLING, ACCESSING, OR USING THE BE-INC OFFICE ADD-INS, TEAMS BOT, OR ANALYTICS DASHBOARD, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE.
              </p>
            </div>
          </Section>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-[#9ca3af]">&copy; 2026 Be-Inc. All rights reserved.</p>
            <p className="text-xs text-[#c4c4c4] mt-1">Version 1.1 | Effective January 6, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-[#5B2D8C] mb-4 flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg text-white text-sm font-bold" style={{ background: "linear-gradient(135deg, #5B2D8C 0%, #6366d6 100%)" }}>
          {number}
        </span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-[#2D3748] mb-3">{title}</h3>
      {children}
    </div>
  );
}
