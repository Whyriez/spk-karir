<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            // Kita ubah 'email' menjadi 'login_id' sesuai input di React
            // Kita hapus validasi 'email' strict karena bisa saja isinya Username/NISN
            'login_id' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        // 1. Ambil Inputan User (Bisa Email atau Username)
        $login_input = $this->input('login_id');

        // 2. Cek Format: Apakah ini Email atau Username?
        // Jika formatnya valid email, kita anggap dia login pakai email.
        // Jika bukan, kita anggap dia login pakai username (NISN).
        $login_type = filter_var($login_input, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        // 3. Susun Kredensial untuk Auth::attempt
        $credentials = [
            $login_type => $login_input,
            'password'  => $this->input('password'),
        ];

        // 4. Coba Login
        if (! Auth::attempt($credentials, $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                // Pastikan key error-nya 'login_id' agar muncul merah di bawah input React
                'login_id' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            // Ganti 'email' jadi 'login_id'
            'login_id' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        // Gunakan 'login_id' sebagai basis key limit
        return Str::transliterate(Str::lower($this->input('login_id')).'|'.$this->ip());
    }
}