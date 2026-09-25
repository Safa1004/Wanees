import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Heart,
  LockKeyhole,
  ShieldCheck,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { api, clearCsrf, download } from "./api";
import { bi } from "./i18n";
import { Heading, Visual } from "./main";
import { useApp } from "./state";
export type Session = {
  authenticated: boolean;
  role: string | null;
  roles: string[];
  email: string | null;
  hospital: string | null;
  demo: boolean;
};
export function useAccount() {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => api<Session>("/session"),
    retry: false,
  });
}
export function ErrorNote({ error }: { error: unknown }) {
  return error ? (
    <p className="account-error" role="alert">
      {error instanceof Error ? error.message : String(error)}
    </p>
  ) : null;
}
export default function Accounts() {
  const session = useAccount();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [register, setRegister] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const [notice, setNotice] = useState("");
  async function logout() {
    await api("/auth/logout", "POST");
    clearCsrf();
    qc.clear();
    useApp.getState().set({ profileId: "" });
    navigate("/account");
  }
  if (session.data?.authenticated)
    return (
      <>
        <Heading
          eyebrow={bi("YOUR SPACE", "مساحتك")}
          title={bi("Lovely to see you.", "سعداء بوجودك.")}
          sub={
            session.data.email || bi("Demonstration session", "جلسة تجريبية")
          }
        />
        <div className="grid2">
          <section className="panel">
            <ShieldCheck />
            <h2>{bi("Your account", "حسابك")}</h2>
            <p>
              {session.data.role === "Guardian"
                ? bi("Parent / user", "ولي أمر / مستخدم")
                : session.data.role}
            </p>
            <p>
              {bi(
                "Child profiles stay inside a parent account. They do not need their own email or password.",
                "تبقى ملفات الأطفال داخل حساب ولي الأمر، ولا تحتاج إلى بريد أو كلمة مرور مستقلة.",
              )}
            </p>
            <div className="account-links">
              <Link className="button primary" to="/chat">
                {bi("Talk to a companion", "تحدث مع رفيق")}
              </Link>
              {session.data.role === "Guardian" && (
                <Link className="button" to="/care">
                  {bi("Family space", "مساحة الأسرة")}
                </Link>
              )}
              {[
                "Editor",
                "Reviewer",
                "HospitalAdmin",
                "PlatformAdmin",
              ].includes(session.data.role || "") && (
                <Link className="button" to="/staff">
                  {bi("Content workspace", "مساحة المحتوى")}
                </Link>
              )}
              {["HospitalAdmin", "PlatformAdmin"].includes(
                session.data.role || "",
              ) && (
                <Link className="button" to="/admin">
                  {bi("Administration", "الإدارة")}
                </Link>
              )}
            </div>
            <div className="account-links">
              {session.data.role === "Clinician" && (
                <Link className="button" to="/clinical">
                  {bi("Shared comfort preferences", "التفضيلات المشتركة")}
                </Link>
              )}
              <button
                className="button"
                onClick={async () => {
                  try {
                    const data = await api("/account/export");
                    download(
                      "wanees-account-export.json",
                      JSON.stringify(data, null, 2),
                      "application/json",
                    );
                  } catch (e) {
                    setError(e);
                  }
                }}
              >
                {bi("Export my data", "تصدير بياناتي")}
              </button>
              {session.data.role !== "PlatformAdmin" && (
                <button
                  className="button"
                  onClick={async () => {
                    if (
                      !window.confirm(
                        bi(
                          "Permanently delete your account, child profiles and conversations? This cannot be undone.",
                          "حذف حسابك وملفات الأطفال والمحادثات نهائيًا؟ لا يمكن التراجع.",
                        ),
                      )
                    )
                      return;
                    try {
                      await api("/account", "DELETE");
                      clearCsrf();
                      qc.clear();
                      useApp.getState().set({ profileId: "" });
                      navigate("/account");
                    } catch (e) {
                      setError(e);
                    }
                  }}
                >
                  {bi("Delete my account", "حذف حسابي")}
                </button>
              )}
            </div>
            <button className="button" onClick={() => logout().catch(setError)}>
              <LogOut size={17} />
              {bi("Sign out", "تسجيل الخروج")}
            </button>
          </section>
          <section className="panel">
            <LockKeyhole />
            <h2>{bi("Change password", "تغيير كلمة المرور")}</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setError(null);
                const form = new FormData(e.currentTarget);
                try {
                  await api("/auth/password", "POST", {
                    currentPassword: form.get("current"),
                    newPassword: form.get("new"),
                  });
                  await logout();
                  setNotice(
                    bi(
                      "Password changed. Please sign in again.",
                      "تم تغيير كلمة المرور. سجّل الدخول مجددًا.",
                    ),
                  );
                } catch (e) {
                  setError(e);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <label>
                {bi("Current password", "كلمة المرور الحالية")}
                <input
                  name="current"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </label>
              <label>
                {bi("New password", "كلمة المرور الجديدة")}
                <input
                  name="new"
                  type="password"
                  minLength={12}
                  maxLength={128}
                  autoComplete="new-password"
                  required
                />
              </label>
              <p className="muted">
                {bi(
                  "12+ characters, with uppercase, lowercase, a number and a symbol.",
                  "١٢ حرفًا على الأقل مع أحرف كبيرة وصغيرة ورقم ورمز.",
                )}
              </p>
              <button className="button" disabled={busy || session.data.demo}>
                {bi("Save password", "حفظ كلمة المرور")}
              </button>
            </form>
          </section>
        </div>
        <ErrorNote error={error} />
      </>
    );
  return (
    <div className="account-layout">
      <section className="account-welcome">
        <span className="eyebrow">WANEES · ونيس</span>
        <h1>
          {bi(
            "A little support.\nA space of your own.",
            "قليل من الدعم.\nومساحة تخصك.",
          )}
        </h1>
        <p>
          {bi(
            "Save your family’s preparation and spend a gentle moment with your companion.",
            "احفظ استعدادات أسرتك واقضِ لحظة هادئة مع رفيقك.",
          )}
        </p>
        <div className="account-character">
          <Visual kind="character" character="Wanees" action="greeting" />
        </div>
        <span className="account-promise">
          <Heart size={18} />
          {bi("Your pace. Your choices.", "بإيقاعك واختياراتك.")}
        </span>
      </section>
      <section className="panel account-form">
        <LockKeyhole size={25} />
        <h2>
          {register
            ? bi("Make yourself at home", "أهلًا بك في مساحتك")
            : bi("Welcome back", "أهلًا بعودتك")}
        </h2>
        <p>
          {register
            ? bi(
                "Create a parent / user account. Staff permissions are assigned by an administrator.",
                "أنشئ حساب ولي أمر / مستخدم. يعيّن المسؤول صلاحيات الموظفين.",
              )
            : bi(
                "Sign in to your private Wanees space.",
                "سجّل الدخول إلى مساحتك الخاصة في ونيس.",
              )}
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            setBusy(true);
            setError(null);
            setNotice("");
            try {
              const body = {
                email: f.get("email"),
                password: f.get("password"),
                consent: f.get("consent") === "on",
              };
              if (register) await api("/auth/register", "POST", body);
              await api("/auth/login", "POST", body);
              clearCsrf();
              qc.clear();
              useApp.getState().set({ profileId: "" });
              navigate("/account");
            } catch (e) {
              setError(e);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            {bi("Email address", "البريد الإلكتروني")}
            <input
              type="email"
              name="email"
              autoComplete="email"
              maxLength={200}
              required
              placeholder="you@example.com"
            />
          </label>
          <label>
            {bi("Password", "كلمة المرور")}
            <input
              type="password"
              name="password"
              autoComplete={register ? "new-password" : "current-password"}
              minLength={register ? 12 : 1}
              maxLength={128}
              required
            />
          </label>
          {register && (
            <>
              <p className="muted">
                {bi(
                  "Use 12+ characters, uppercase and lowercase letters, a number and a symbol.",
                  "استخدم ١٢ حرفًا على الأقل مع أحرف كبيرة وصغيرة ورقم ورمز.",
                )}
              </p>
              <label className="check-label">
                <input name="consent" type="checkbox" required />
                {bi(
                  "I am an adult creating this account. I have read the privacy information.",
                  "أنا بالغ أنشئ هذا الحساب وقد قرأت معلومات الخصوصية.",
                )}
              </label>
            </>
          )}
          <Link to="/care/privacy">
            {bi("Privacy information", "معلومات الخصوصية")}
          </Link>
          <ErrorNote error={error || session.error} />
          {notice && <p role="status">{notice}</p>}
          {session.data?.demo && (
            <p role="status">
              {bi(
                "This launcher is in demonstration mode. Start the standard PostgreSQL account version to register.",
                "هذا التشغيل في الوضع التجريبي. شغّل النسخة القياسية لإنشاء حساب.",
              )}
            </p>
          )}
          <button
            disabled={busy || session.data?.demo}
            className="button primary account-submit"
          >
            {busy
              ? bi("One moment…", "لحظة…")
              : register
                ? bi("Create account", "إنشاء حساب")
                : bi("Sign in", "تسجيل الدخول")}
            <ArrowRight size={18} />
          </button>
        </form>
        <button
          className="text-button"
          onClick={() => {
            setRegister(!register);
            setError(null);
          }}
        >
          {register
            ? bi("Already have an account? Sign in", "لديك حساب؟ سجّل الدخول")
            : bi("New here? Create an account", "أول زيارة؟ أنشئ حسابًا")}
        </button>
        <p className="muted">
          {bi(
            "Public exploration is always available without an account.",
            "يمكنك الاستكشاف العام دائمًا دون حساب.",
          )}
        </p>
        <Link to="/explore">
          {bi("Continue exploring", "متابعة الاستكشاف")}
        </Link>
      </section>
    </div>
  );
}
export function Admin() {
  const session = useAccount();
  const qc = useQueryClient();
  const [error, setError] = useState<unknown>();
  const [busy, setBusy] = useState(false);
  const allowed = ["PlatformAdmin", "HospitalAdmin"].includes(
    session.data?.role || "",
  );
  const users = useQuery({
    queryKey: ["admin-users"],
    queryFn: () =>
      api<
        {
          id: string;
          email: string;
          roles: string[];
          hospital: string | null;
        }[]
      >("/admin/users"),
    enabled: allowed,
  });
  return (
    <>
      <Heading
        eyebrow={bi("ADMINISTRATION", "الإدارة")}
        title={bi("People & permissions", "الأشخاص والصلاحيات")}
        sub={bi(
          "Adults manage accounts. Children use parent-managed profiles.",
          "يدير البالغون الحسابات ويستخدم الأطفال ملفات بإدارة الأهل.",
        )}
      />
      {!allowed ? (
        <section className="panel">
          <p>
            {bi(
              "An administrator account is needed here.",
              "تحتاج إلى حساب مسؤول هنا.",
            )}
          </p>
          <Link to="/account">
            {bi("Go to your account", "انتقل إلى حسابك")}
          </Link>
        </section>
      ) : (
        <section className="panel">
          <p>
            {bi(
              "Showing up to 200 accounts. Role changes sign the affected user out on their next request. Hospital administrators can view their hospital’s team; platform administrators can assign roles.",
              "يُعرض حتى ٢٠٠ حساب. تغييرات الصلاحيات تسجّل خروج المستخدم عند طلبه التالي. يستطيع مسؤول المستشفى عرض فريقه ويستطيع مسؤول المنصة تعيين الأدوار.",
            )}
          </p>
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>{bi("Account", "الحساب")}</th>
                  <th>{bi("Role", "الدور")}</th>
                  <th>{bi("Hospital", "المستشفى")}</th>
                  <th>{bi("Change role", "تغيير الدور")}</th>
                </tr>
              </thead>
              <tbody>
                {users.data?.map((u) => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>{u.roles.join(", ")}</td>
                    <td>{u.hospital || "—"}</td>
                    <td>
                      <select
                        aria-label={`${bi("Role for", "دور")} ${u.email}`}
                        value={u.roles[0] || "Guardian"}
                        disabled={
                          busy ||
                          session.data?.role !== "PlatformAdmin" ||
                          session.data.email === u.email
                        }
                        onChange={async (e) => {
                          setBusy(true);
                          setError(null);
                          try {
                            await api(`/admin/users/${u.id}/role`, "PUT", {
                              role: e.target.value,
                              hospital: "al-bahar",
                            });
                            await qc.invalidateQueries({
                              queryKey: ["admin-users"],
                            });
                          } catch (e) {
                            setError(e);
                          } finally {
                            setBusy(false);
                          }
                        }}
                      >
                        {[
                          "Guardian",
                          "Clinician",
                          "Editor",
                          "Reviewer",
                          "HospitalAdmin",
                          "PlatformAdmin",
                        ].map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ErrorNote error={error || users.error} />
        </section>
      )}
    </>
  );
}

export function Clinical() {
  const account = useAccount();
  const navigate = useNavigate();
  const [error, setError] = useState<unknown>();
  return (
    <>
      <Heading
        eyebrow={bi("CLINICIAN SPACE", "مساحة الفريق السريري")}
        title={bi("Start with what matters to them.", "ابدأ بما يهمّهم.")}
        sub={bi(
          "Read comfort preferences only when a caregiver chooses to share them.",
          "اقرأ تفضيلات الراحة فقط عندما يختار ولي الأمر مشاركتها.",
        )}
      />
      <section className="panel">
        {account.data?.role !== "Clinician" ? (
          <Link to="/account">
            {bi("Sign in with a clinician account", "سجّل الدخول بحساب سريري")}
          </Link>
        ) : (
          <>
            <p>
              {bi(
                "Ask the caregiver for their one-hour share link. There is no searchable list of children or medical records here.",
                "اطلب من ولي الأمر رابط المشاركة الصالح لساعة. لا توجد هنا قائمة أطفال أو سجلات طبية قابلة للبحث.",
              )}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = String(
                  new FormData(e.currentTarget).get("share") || "",
                ).trim();
                const token = input.match(
                  /(?:^|\/shared\/)([a-fA-F0-9]{64})$/,
                )?.[1];
                if (!token) {
                  setError(
                    new Error(
                      bi(
                        "Enter a valid Wanees share link or 64-character share code.",
                        "أدخل رابط مشاركة ونيس صالحًا أو رمز المشاركة المكوّن من ٦٤ حرفًا.",
                      ),
                    ),
                  );
                  return;
                }
                navigate("/shared/" + token);
              }}
            >
              <label>
                {bi("Caregiver’s share link", "رابط مشاركة ولي الأمر")}
                <input name="share" required autoComplete="off" />
              </label>
              <button className="button primary">
                {bi("Open shared preferences", "افتح التفضيلات المشتركة")}
              </button>
            </form>
            <ErrorNote error={error} />
          </>
        )}
      </section>
    </>
  );
}
