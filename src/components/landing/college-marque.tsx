"use client";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";

export function CollegeMarquee() {
    const images = [
        "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
        "https://imgs.search.brave.com/29CZPF-utFJ8rmxyxT1Iuqx0gWjx6GCTJDLQ55b7uJs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTEtNS5qcGc",
        "https://imgs.search.brave.com/gBdqJ9NhItJBAU4wFIp18rRMJY0-D-tzAApMnPJOexY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Y29sbGVnZWJhdGNo/LmNvbS9zdGF0aWMv/Y2xnLWdhbGxlcnkv/a29uYXJrLWluc3Rp/dHV0ZS1vZi1zY2ll/bmNlLXRlY2hub2xv/Z3ktYmh1YmFuZXN3/YXItMzE3NTQxLmpw/Zw",
        "https://imgs.search.brave.com/hVjPGo4VRRMJ35ilyTB6Jnb8ho5dgffD0ol8JLcB5EU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTItNS5qcGc",
        "https://imgs.search.brave.com/CRJZbNRWb6Ul2jpLUBuW5Tt9nbXmvMgILm5_5eVaG9o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTMtNS5qcGc",
        "https://imgs.search.brave.com/mAD39g12Lm54HPVMcH7n3Jak9MGl7OxInKXltvOx9EA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTctNS5qcGc",
        "https://imgs.search.brave.com/kKAmqObZDo2ZBeEGHNhuvotctMuCiLvRBG9zMbaH1hM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTgtNS5qcGc",
        "https://imgs.search.brave.com/1bjS6Cwf9DGMESWnOg59R9rQFShUJnFkG-oxH4z70Gc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jaHVu/b2NvbGxlZ2UuczMu/YXAtc291dGgtMS5h/bWF6b25hd3MuY29t/L2ltYWdlcy9idGVj/aC9TcmVlcGF0aHkt/SW5zdGl0dXRlLW9m/LU1hbmFnZW1lbnQt/YW5kLVRlY2hub2xv/Z3ktY2FtcHVzLnBu/Zw",
        "https://imgs.search.brave.com/O_cUZ2XRwZOak-Kge3erqENnSdYJTxKltl2DMo71FCc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dW5pdmVyc2l0eWth/cnQuY29tLy9Db250/ZW50L3VwbG9hZC9h/ZG1pbi9oamJoc3My/dC5kZ2suanBn",
        "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
        "https://imgs.search.brave.com/29CZPF-utFJ8rmxyxT1Iuqx0gWjx6GCTJDLQ55b7uJs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTEtNS5qcGc",
        "https://imgs.search.brave.com/gBdqJ9NhItJBAU4wFIp18rRMJY0-D-tzAApMnPJOexY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Y29sbGVnZWJhdGNo/LmNvbS9zdGF0aWMv/Y2xnLWdhbGxlcnkv/a29uYXJrLWluc3Rp/dHV0ZS1vZi1zY2ll/bmNlLXRlY2hub2xv/Z3ktYmh1YmFuZXN3/YXItMzE3NTQxLmpw/Zw",
        "https://imgs.search.brave.com/hVjPGo4VRRMJ35ilyTB6Jnb8ho5dgffD0ol8JLcB5EU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTItNS5qcGc",
        "https://imgs.search.brave.com/CRJZbNRWb6Ul2jpLUBuW5Tt9nbXmvMgILm5_5eVaG9o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTMtNS5qcGc",
        "https://imgs.search.brave.com/mAD39g12Lm54HPVMcH7n3Jak9MGl7OxInKXltvOx9EA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTctNS5qcGc",
        "https://imgs.search.brave.com/kKAmqObZDo2ZBeEGHNhuvotctMuCiLvRBG9zMbaH1hM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTgtNS5qcGc",
        "https://imgs.search.brave.com/1bjS6Cwf9DGMESWnOg59R9rQFShUJnFkG-oxH4z70Gc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jaHVu/b2NvbGxlZ2UuczMu/YXAtc291dGgtMS5h/bWF6b25hd3MuY29t/L2ltYWdlcy9idGVj/aC9TcmVlcGF0aHkt/SW5zdGl0dXRlLW9m/LU1hbmFnZW1lbnQt/YW5kLVRlY2hub2xv/Z3ktY2FtcHVzLnBu/Zw",
        "https://imgs.search.brave.com/O_cUZ2XRwZOak-Kge3erqENnSdYJTxKltl2DMo71FCc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dW5pdmVyc2l0eWth/cnQuY29tLy9Db250/ZW50L3VwbG9hZC9h/ZG1pbi9oamJoc3My/dC5kZ2suanBn",
        "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
        "https://assets.aceternity.com/animated-modal.png",
        "https://assets.aceternity.com/animated-testimonials.webp",
        "https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png",
        "https://imgs.search.brave.com/29CZPF-utFJ8rmxyxT1Iuqx0gWjx6GCTJDLQ55b7uJs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTEtNS5qcGc",
        "https://imgs.search.brave.com/gBdqJ9NhItJBAU4wFIp18rRMJY0-D-tzAApMnPJOexY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Y29sbGVnZWJhdGNo/LmNvbS9zdGF0aWMv/Y2xnLWdhbGxlcnkv/a29uYXJrLWluc3Rp/dHV0ZS1vZi1zY2ll/bmNlLXRlY2hub2xv/Z3ktYmh1YmFuZXN3/YXItMzE3NTQxLmpw/Zw",
        "https://imgs.search.brave.com/hVjPGo4VRRMJ35ilyTB6Jnb8ho5dgffD0ol8JLcB5EU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTItNS5qcGc",
        "https://imgs.search.brave.com/CRJZbNRWb6Ul2jpLUBuW5Tt9nbXmvMgILm5_5eVaG9o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTMtNS5qcGc",
        "https://imgs.search.brave.com/mAD39g12Lm54HPVMcH7n3Jak9MGl7OxInKXltvOx9EA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTctNS5qcGc",
        "https://imgs.search.brave.com/kKAmqObZDo2ZBeEGHNhuvotctMuCiLvRBG9zMbaH1hM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTgtNS5qcGc",
        "https://imgs.search.brave.com/1bjS6Cwf9DGMESWnOg59R9rQFShUJnFkG-oxH4z70Gc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jaHVu/b2NvbGxlZ2UuczMu/YXAtc291dGgtMS5h/bWF6b25hd3MuY29t/L2ltYWdlcy9idGVj/aC9TcmVlcGF0aHkt/SW5zdGl0dXRlLW9m/LU1hbmFnZW1lbnQt/YW5kLVRlY2hub2xv/Z3ktY2FtcHVzLnBu/Zw",
        "https://imgs.search.brave.com/O_cUZ2XRwZOak-Kge3erqENnSdYJTxKltl2DMo71FCc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dW5pdmVyc2l0eWth/cnQuY29tLy9Db250/ZW50L3VwbG9hZC9h/ZG1pbi9oamJoc3My/dC5kZ2suanBn",
        "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
        "https://imgs.search.brave.com/29CZPF-utFJ8rmxyxT1Iuqx0gWjx6GCTJDLQ55b7uJs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTEtNS5qcGc",
        "https://imgs.search.brave.com/gBdqJ9NhItJBAU4wFIp18rRMJY0-D-tzAApMnPJOexY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Y29sbGVnZWJhdGNo/LmNvbS9zdGF0aWMv/Y2xnLWdhbGxlcnkv/a29uYXJrLWluc3Rp/dHV0ZS1vZi1zY2ll/bmNlLXRlY2hub2xv/Z3ktYmh1YmFuZXN3/YXItMzE3NTQxLmpw/Zw",
        "https://imgs.search.brave.com/hVjPGo4VRRMJ35ilyTB6Jnb8ho5dgffD0ol8JLcB5EU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTItNS5qcGc",
        "https://imgs.search.brave.com/CRJZbNRWb6Ul2jpLUBuW5Tt9nbXmvMgILm5_5eVaG9o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTMtNS5qcGc",
        "https://imgs.search.brave.com/mAD39g12Lm54HPVMcH7n3Jak9MGl7OxInKXltvOx9EA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTctNS5qcGc",
        "https://imgs.search.brave.com/kKAmqObZDo2ZBeEGHNhuvotctMuCiLvRBG9zMbaH1hM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/Y29sbGVnZWZpbmRl/cmluZGlhLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/MS9Lb25hcmstSW5z/dGl0dXRlLW9mLVNj/aWVuY2UtYW5kLVRl/Y2hub2xvZ3ktQmh1/YmFuZXN3YXItS0lT/VC1HYWxsZXJ5LUlt/YWdlLTgtNS5qcGc",
        "https://imgs.search.brave.com/1bjS6Cwf9DGMESWnOg59R9rQFShUJnFkG-oxH4z70Gc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jaHVu/b2NvbGxlZ2UuczMu/YXAtc291dGgtMS5h/bWF6b25hd3MuY29t/L2ltYWdlcy9idGVj/aC9TcmVlcGF0aHkt/SW5zdGl0dXRlLW9m/LU1hbmFnZW1lbnQt/YW5kLVRlY2hub2xv/Z3ktY2FtcHVzLnBu/Zw",
        "https://imgs.search.brave.com/O_cUZ2XRwZOak-Kge3erqENnSdYJTxKltl2DMo71FCc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dW5pdmVyc2l0eWth/cnQuY29tLy9Db250/ZW50L3VwbG9hZC9h/ZG1pbi9oamJoc3My/dC5kZ2suanBn",
        "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
        "https://assets.aceternity.com/animated-modal.png",
        "https://assets.aceternity.com/animated-testimonials.webp",
        "https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png",



    ];
    return (
        <div className="mx-auto my-2 w-full rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800">
            <ThreeDMarquee images={images} className="h-[75vh]" />
        </div>
    );
}
