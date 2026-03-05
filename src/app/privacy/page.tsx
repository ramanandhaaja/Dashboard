import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Be-Inc",
  description: "Be-Inc Privacy Policy for Microsoft Office Add-ins and Teams Bot",
};

export default function PrivacyPolicyPage() {
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
              <Link href="/terms" className="text-sm text-[#6b7280] hover:text-[#5B2D8C] transition-colors">
                Terms of Service
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
          <h1 className="font-serif-display text-3xl text-[#1a1a2e] mb-2">Privacy Policy</h1>
          <div className="w-16 h-1 bg-[#5B2D8C] rounded-full mb-6" />
          <p className="text-sm text-[#9ca3af] mb-2"><strong>Effective Date:</strong> January 6, 2026</p>
          <p className="text-sm text-[#9ca3af] mb-8"><strong>Last Updated:</strong> March 5, 2026</p>

          <p className="text-[#4a5568] leading-relaxed mb-6">
            Welcome to <strong className="text-[#5B2D8C]">Be-Inc</strong>. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our Microsoft Office Add-ins (Word, Outlook, and Teams) and the Be-Inc Analytics Dashboard. By using our Services, you consent to the practices described in this Privacy Policy.
          </p>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-8">
            <p className="text-sm text-red-800 font-medium">
              <strong>IMPORTANT:</strong> Our Services use AI (via Azure OpenAI) to analyze your content for diversity, equity, and inclusion (DE&I) compliance. Your content is sent to AI services for processing. Please review this Privacy Policy carefully to understand how your data is handled.
            </p>
          </div>

          {/* Section 1 */}
          <Section number="1" title="Information We Collect">
            <SubSection title="1.1 Content You Provide">
              <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
                <li><strong className="text-[#5B2D8C]">Word Documents:</strong> Text content you analyze or request AI assistance for via the Word Add-in</li>
                <li><strong className="text-[#5B2D8C]">Outlook Emails:</strong> Email body and subject line text when you request DE&I analysis via the Outlook Add-in</li>
                <li><strong className="text-[#5B2D8C]">Teams Messages:</strong> Message content analyzed by the Teams Bot for DE&I compliance. <strong>Full messages are NEVER stored</strong> &mdash; only flagged words are recorded</li>
                <li><strong className="text-[#5B2D8C]">Dashboard:</strong> Your account information (email, name) when you sign up for the analytics dashboard</li>
              </ul>
            </SubSection>

            <SubSection title="1.2 Teams Bot Data (Privacy-First Design)">
              <div className="bg-[#F5F3FF] border-l-4 border-[#5B2D8C] p-4 rounded-r-lg">
                <p className="text-sm text-[#4a5568] mb-2"><strong>The Teams Bot is designed with privacy as a core principle:</strong></p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-[#4a5568]">
                  <li>Full messages are <strong>immediately discarded</strong> after AI analysis</li>
                  <li>Only flagged words, categories, and a 3-5 word context snippet are stored</li>
                  <li>User identities are <strong>hashed with SHA-256</strong> (one-way, irreversible)</li>
                  <li>No message content is ever written to logs or stored in any database</li>
                </ul>
              </div>
            </SubSection>

            <SubSection title="1.3 Settings and Preferences">
              <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
                <li><strong className="text-[#5B2D8C]">Add-in Settings:</strong> Your preferences for sensitivity levels, auto-correction, tone, and send validation</li>
                <li><strong className="text-[#5B2D8C]">Correction History:</strong> Record of corrections you&apos;ve accepted or applied (stored locally in your Office.js roaming settings)</li>
              </ul>
            </SubSection>

            <SubSection title="1.4 Technical Information">
              <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
                <li><strong className="text-[#5B2D8C]">Office Context:</strong> Office.js provides us with your user ID and session information</li>
                <li><strong className="text-[#5B2D8C]">Browser Information:</strong> Browser type, version, and user agent (collected automatically)</li>
                <li><strong className="text-[#5B2D8C]">Error Logs:</strong> Technical error messages if the services encounter issues</li>
              </ul>
            </SubSection>

            <SubSection title="1.5 Information We Do NOT Collect">
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                <p className="text-sm text-[#4a5568] font-medium mb-2">We do NOT collect or store:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-[#4a5568]">
                  <li>Full email or document content (beyond what is sent to AI for analysis)</li>
                  <li>Full Teams messages (discarded immediately after analysis)</li>
                  <li>Email recipients, attachments, or metadata</li>
                  <li>Payment information (our Services are free)</li>
                  <li>Biometric data or health information</li>
                  <li>Location data</li>
                </ul>
              </div>
            </SubSection>
          </Section>

          {/* Section 2 */}
          <Section number="2" title="How We Use Your Information">
            <SubSection title="2.1 AI-Powered Analysis">
              <p className="text-[#4a5568] mb-3">Your content is sent to <strong className="text-[#5B2D8C]">Azure OpenAI</strong> for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
                <li><strong className="text-[#5B2D8C]">DE&I Compliance Analysis:</strong> Identifying potentially problematic language (gendered terms, ableist language, cultural insensitivity)</li>
                <li><strong className="text-[#5B2D8C]">Suggested Alternatives:</strong> Generating inclusive language alternatives</li>
                <li><strong className="text-[#5B2D8C]">Compliance Reporting:</strong> Aggregating flagged words (not messages) for organizational DE&I analytics</li>
              </ul>
            </SubSection>

            <SubSection title="2.2 Analytics Dashboard">
              <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
                <li><strong className="text-[#5B2D8C]">Aggregate Reporting:</strong> DE&I compliance trends across teams and channels (using only flagged words, not messages)</li>
                <li><strong className="text-[#5B2D8C]">User Authentication:</strong> Securely managing dashboard access via Supabase authentication</li>
              </ul>
            </SubSection>

            <SubSection title="2.3 Caching and Performance">
              <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
                <li><strong className="text-[#5B2D8C]">LRU Cache:</strong> Temporarily caching AI analysis results in-memory to improve performance and reduce API costs</li>
                <li><strong className="text-[#5B2D8C]">Content Hashing:</strong> Hashing document content to detect changes (hash only, not content)</li>
              </ul>
            </SubSection>
          </Section>

          {/* Section 3 */}
          <Section number="3" title="Data Sharing and Third-Party Services">
            <SubSection title="3.1 Azure OpenAI">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <p className="text-sm text-[#4a5568] mb-2"><strong>Your content is sent to Azure OpenAI for AI-powered analysis.</strong></p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-[#4a5568]">
                  <li><strong>Data Sent:</strong> Text content you analyze (Word, Outlook) or flagged message content (Teams)</li>
                  <li><strong>Azure OpenAI Privacy:</strong> Microsoft does NOT use your data to train AI models</li>
                  <li><strong>Data residency:</strong> Processed on Microsoft Azure infrastructure</li>
                </ul>
              </div>
            </SubSection>

            <SubSection title="3.2 Supabase (Database)">
              <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
                <li><strong className="text-[#5B2D8C]">What is stored:</strong> Flagged DE&I words, categories, hashed user IDs, team/channel names, timestamps</li>
                <li><strong className="text-[#5B2D8C]">What is NOT stored:</strong> Full messages, email content, document content</li>
                <li><strong className="text-[#5B2D8C]">Authentication:</strong> User accounts for dashboard access (email, hashed password)</li>
              </ul>
            </SubSection>

            <SubSection title="3.3 Microsoft Office.js">
              <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
                <li><strong className="text-[#5B2D8C]">Roaming Settings:</strong> Your preferences sync across your Microsoft 365 account</li>
                <li><strong className="text-[#5B2D8C]">Microsoft Graph API:</strong> Used by Teams Bot to resolve team/channel names and user department info</li>
              </ul>
            </SubSection>

            <SubSection title="3.4 No Other Third-Party Sharing">
              <p className="text-[#4a5568]">We do NOT share your data with advertisers, analytics services, social media platforms, or data brokers.</p>
            </SubSection>
          </Section>

          {/* Section 4 */}
          <Section number="4" title="Data Storage and Retention">
            <SubSection title="4.1 Where Your Data is Stored">
              <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
                <li><strong className="text-[#5B2D8C]">Azure OpenAI:</strong> Content processed on Microsoft Azure (not retained after analysis)</li>
                <li><strong className="text-[#5B2D8C]">Supabase Cloud:</strong> Flagged DE&I words and dashboard user accounts</li>
                <li><strong className="text-[#5B2D8C]">Office.js Roaming Settings:</strong> Add-in settings stored in Microsoft&apos;s cloud</li>
                <li><strong className="text-[#5B2D8C]">Browser Memory:</strong> AI analysis results cached temporarily in browser</li>
              </ul>
            </SubSection>

            <SubSection title="4.2 Retention Periods">
              <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
                <li><strong className="text-[#5B2D8C]">AI-analyzed content:</strong> Deleted immediately after analysis</li>
                <li><strong className="text-[#5B2D8C]">Flagged DE&I words:</strong> Retained for compliance reporting until deletion is requested</li>
                <li><strong className="text-[#5B2D8C]">Add-in settings:</strong> Retained until you uninstall the add-in</li>
                <li><strong className="text-[#5B2D8C]">Dashboard accounts:</strong> Retained until you request deletion</li>
                <li><strong className="text-[#5B2D8C]">Cache:</strong> Cleared when you close the Office application</li>
              </ul>
            </SubSection>
          </Section>

          {/* Section 5 */}
          <Section number="5" title="Data Security">
            <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
              <li><strong className="text-[#5B2D8C]">HTTPS Encryption:</strong> All communication uses HTTPS/TLS encryption</li>
              <li><strong className="text-[#5B2D8C]">Password Hashing:</strong> Dashboard passwords are hashed with bcrypt (12 rounds)</li>
              <li><strong className="text-[#5B2D8C]">User ID Hashing:</strong> Teams user identities are SHA-256 hashed (irreversible)</li>
              <li><strong className="text-[#5B2D8C]">XSS Protection:</strong> React&apos;s safe rendering prevents cross-site scripting attacks</li>
              <li><strong className="text-[#5B2D8C]">Server-to-server auth:</strong> Bot-to-Dashboard communication uses secret-based authentication</li>
              <li><strong className="text-[#5B2D8C]">Row-Level Security:</strong> Supabase database uses RLS policies for data isolation</li>
            </ul>
          </Section>

          {/* Section 6 */}
          <Section number="6" title="Your Rights and Choices">
            <SubSection title="6.1 Access and Deletion">
              <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
                <li><strong className="text-[#5B2D8C]">View Settings:</strong> Access your settings via the Settings tab in any add-in</li>
                <li><strong className="text-[#5B2D8C]">Clear History:</strong> Delete correction history via the History tab</li>
                <li><strong className="text-[#5B2D8C]">Delete Account:</strong> Contact us to delete your dashboard account and all associated data</li>
                <li><strong className="text-[#5B2D8C]">Request Data Deletion:</strong> Contact <a href="mailto:support@be-inc.ai" className="text-[#5B2D8C] underline">support@be-inc.ai</a></li>
              </ul>
            </SubSection>

            <SubSection title="6.2 Opt-Out of AI Analysis">
              <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
                <li><strong className="text-[#5B2D8C]">Disable Auto-Detection:</strong> Turn off auto-detection in Settings</li>
                <li><strong className="text-[#5B2D8C]">Remove Teams Bot:</strong> Uninstall the bot from your team to stop message monitoring</li>
                <li><strong className="text-[#5B2D8C]">Uninstall Add-ins:</strong> Remove any add-in to stop all data collection</li>
              </ul>
            </SubSection>

            <SubSection title="6.3 GDPR and CCPA Rights">
              <p className="text-[#4a5568]">
                If you are in the EU or California, you have rights to access, delete, rectify, and port your data. Contact{" "}
                <a href="mailto:support@be-inc.ai" className="text-[#5B2D8C] underline">support@be-inc.ai</a> to exercise these rights.
              </p>
            </SubSection>
          </Section>

          {/* Section 7 */}
          <Section number="7" title="Children's Privacy">
            <p className="text-[#4a5568]">
              Our Services are NOT intended for children under 13 years old. We do not knowingly collect personal information from children.
            </p>
          </Section>

          {/* Section 8 */}
          <Section number="8" title="Changes to This Privacy Policy">
            <p className="text-[#4a5568]">
              We may update this Privacy Policy from time to time. Changes will be effective when posted. Your continued use constitutes acceptance of the updated Privacy Policy.
            </p>
          </Section>

          {/* Section 9 */}
          <Section number="9" title="Contact Us">
            <div className="bg-[#F5F3FF] p-6 rounded-xl">
              <p className="text-[#4a5568] font-medium mb-3">If you have questions about this Privacy Policy, please contact us:</p>
              <p className="text-[#4a5568]"><strong className="text-[#5B2D8C]">Email:</strong> <a href="mailto:support@be-inc.ai" className="text-[#5B2D8C] underline">support@be-inc.ai</a></p>
              <p className="text-[#4a5568]"><strong className="text-[#5B2D8C]">Website:</strong> <a href="https://be-inc.ai" className="text-[#5B2D8C] underline">https://be-inc.ai</a></p>
            </div>
          </Section>

          {/* Section 10 */}
          <Section number="10" title="Additional Resources">
            <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
              <li><Link href="/terms" className="text-[#5B2D8C] underline">Terms of Service</Link></li>
              <li><a href="https://privacy.microsoft.com" target="_blank" rel="noopener noreferrer" className="text-[#5B2D8C] underline">Microsoft Privacy Statement</a></li>
              <li><a href="https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy" target="_blank" rel="noopener noreferrer" className="text-[#5B2D8C] underline">Azure OpenAI Data Privacy</a></li>
            </ul>
          </Section>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-[#9ca3af]">&copy; 2026 Be-Inc. All rights reserved.</p>
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
