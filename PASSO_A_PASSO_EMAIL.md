# Passo a passo: e-mail próprio para o Sibi

Hoje o Supabase só manda e-mail de confirmação para quem é da sua organização, e no máximo 2 por hora. Por isso amigos ainda não conseguem criar conta. Com o Gmail como remetente, o limite sobe para cerca de 500 e-mails por dia, o que basta para a fase de teste.

São quatro partes (a última é opcional), uns 10 minutos no total. Só você pode fazer, porque envolve a senha da sua conta Google. Não me mande a senha: ela vai direto do Google para o painel do Supabase.

## 1. Criar a senha de app no Google

1. Abra <https://myaccount.google.com/security> com a conta Gmail que vai mandar os e-mails.
2. Confira se a **Verificação em duas etapas** está ativada. Se não estiver, ative primeiro: sem ela o Google não deixa criar senha de app.
3. Abra <https://myaccount.google.com/apppasswords>.
4. No nome do app, escreva `Sibi` e clique em **Criar**.
5. O Google mostra uma senha de 16 letras. Copie e deixe a janela aberta: ela só aparece uma vez.

## 2. Colar no Supabase

1. Abra <https://supabase.com/dashboard>, entre no projeto **sibi-dev**.
2. Vá em **Authentication**, depois **Emails**, depois a aba **SMTP Settings**.
3. Ligue **Enable custom SMTP** e preencha:

   | Campo | Valor |
   | --- | --- |
   | Sender email | o seu endereço do Gmail |
   | Sender name | `Sibi` |
   | Host | `smtp.gmail.com` |
   | Port number | `465` |
   | Username | o seu endereço do Gmail |
   | Password | a senha de 16 letras do passo 1 |

4. Clique em **Save changes**.
5. Vá em **Authentication**, depois **Rate Limits**, e mude **Rate limit for sending emails** para `100` por hora. Salve.

## 3. Conferir os endereços do site

Em **Authentication**, depois **URL Configuration**:

- **Site URL:** `https://sibi-three.vercel.app`
- **Redirect URLs:** deve ter `https://sibi-three.vercel.app/**`. Se não tiver, clique em **Add URL** e adicione.

## 4. Textos dos e-mails em português (opcional, mas recomendado)

Em **Authentication**, depois **Emails**, aba **Templates**. Em cada modelo, troque o assunto e o corpo pelo texto abaixo e salve.

### Confirm signup

Assunto: `Confirme seu e-mail no Sibi`

```html
<h2>Falta só um passo</h2>
<p>Toque no botão para confirmar seu e-mail e começar a treinar Python no Sibi.</p>
<p><a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email">Confirmar meu e-mail</a></p>
<p>Se não foi você que criou a conta, pode ignorar este e-mail.</p>
```

### Reset Password

Assunto: `Crie uma nova senha no Sibi`

```html
<h2>Nova senha</h2>
<p>Toque no botão para escolher uma nova senha no Sibi. O link vale por uma hora.</p>
<p><a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=recovery">Criar nova senha</a></p>
<p>Se você não pediu isso, pode ignorar este e-mail: sua senha continua a mesma.</p>
```

Esses links abrem a confirmação direto no site, mesmo que a pessoa abra o e-mail em outro celular ou navegador.

## Quando terminar

Me avise com "pronto". Eu crio uma conta nova com um endereço de teste, confiro se o e-mail chega e se o link funciona, e só então tiro o aviso de que amigos não conseguem se cadastrar.
