
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("請輸入有效的電子郵件地址").min(1, "電子郵件為必填項目"),
  password: z.string().min(6, "密碼至少需要6個字符").min(1, "密碼為必填項目"),
  // rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Test accounts for development
  const testAccounts = [
    { email: "vendor_admin@mail.com", password: "test1234", role: "Seller" },
    { email: "remanufactures_admin@mail.com", password: "test1234", role: "Buyer Admin" },
    { email: "remanufactures_agent@mail.com", password: "test1234", role: "Buyer Agent" },
  ];

  const handleLogin = async (formData: LoginFormData) => {
    console.log(`[${new Date(Date.now()).toLocaleString()}] 開始登入流程`)
    try {
      setLoading(true);
      setErrorMessage("");

      console.log('🔐 開始登入流程:', formData.email);
      console.log('🔐 登入模式:', isSignUp ? '註冊' : '登入');

      // Mock authentication - simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      if (isSignUp) {
        // Mock sign up - just show success message
        console.log('🔐 註冊成功 (Mock)');
        toast({
          title: "註冊成功",
          description: "您的帳號已建立完成！",
        });
        setIsSignUp(false); // Switch back to login mode
      } else {
        // Mock login - check against test accounts or accept any valid email/password
        const validAccount = testAccounts.find(acc =>
          acc.email === formData.email && acc.password === formData.password
        );

        if (validAccount || (formData.email && formData.password.length >= 6)) {
          console.log('🔐 登入成功 (Mock) - Email:', formData.email);
          toast({
            title: "登入成功",
            description: `歡迎回來${validAccount ? ` - ${validAccount.role}` : ''}！`,
          });

          // Store mock user session
          localStorage.setItem('mockUser', JSON.stringify({
            email: formData.email,
            role: validAccount?.role || 'User',
            loginTime: new Date().toISOString()
          }));

          onLogin();
        } else {
          console.error('🔐 登入錯誤 (Mock): 帳號或密碼錯誤');
          setErrorMessage("帳號或密碼錯誤，請檢查後重試");
        }
      }
    } catch (error: any) {
      console.error('🔐 意外的登入錯誤:', error);
      setErrorMessage("登入時發生錯誤，請稍後再試");
    } finally {
      console.log('🔐 登入流程結束，載入狀態設為 false');
      setLoading(false);
    }
  };

  const test = (d) => {console.log(`[${new Date(Date.now()).toLocaleString()}] get submit event. ${JSON.stringify(Object.keys(d))}`)}

  const handleTestLogin = (testAccount: typeof testAccounts[0]) => {
    setValue("email", testAccount.email);
    setValue("password", testAccount.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/20"></div>
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">CH</span>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            CoreHub
          </CardTitle>
          <p className="text-muted-foreground mt-2">Enterprise Resource Management Platform</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(handleLogin, test)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">電子郵件</Label>
              <Input
                id="email"
                type="email"
                placeholder="請輸入您的電子郵件"
                {...register("email")}
                className="h-12"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密碼</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="請輸入您的密碼"
                  {...register("password")}
                  className="h-12 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* <div className="flex items-center space-x-2">
              <Checkbox id="rememberMe" {...register("rememberMe")} />
              <Label htmlFor="rememberMe" className="text-sm text-muted-foreground">
                記住我
              </Label>
            </div> */}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? "註冊中..." : "登入中..."}
                </>
              ) : (
                isSignUp ? "註冊" : "登入"
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMessage("");
                }}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {isSignUp ? "已有帳號？點此登入" : "沒有帳號？點此註冊"}
              </Button>
            </div>
          </form>

          {/* Test Accounts - Available in all environments */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowTestAccounts(!showTestAccounts)}
              className="w-full mb-3"
            >
              {showTestAccounts ? "隱藏" : "顯示"}測試帳號
            </Button>
            
            {showTestAccounts && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-2">開發測試帳號：</p>
                {testAccounts.map((account, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTestLogin(account)}
                    className="w-full justify-start text-xs"
                  >
                    <span className="font-medium">{account.role}</span>
                    <span className="ml-2 text-muted-foreground">{account.email}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
