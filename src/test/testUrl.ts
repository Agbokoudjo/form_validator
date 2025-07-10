import {
    checkHost
} from "../_Utils";

jQuery(function testUrl() {
    const matches: (string | RegExp)[] = [
        'localhost',
        'admin.noldfinance.com',
        /\.example\.org$/i,
    ];

    console.log(checkHost('admin.noldfinance.com', matches)); // ✅ true
    console.log(checkHost('shop.example.org', matches));      // ✅ true (regex match)
    console.log(checkHost('google.com', matches));
})