import { createClient } from "@supabase/supabase-js";

const anonKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqeXZzY2NxZHZ6bXNvb3RldnVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjg3ODIsImV4cCI6MjA3MTcwNDc4Mn0._UROOdpCU5IlFtwVP8kNktFlXUfo3QU_YwihNh7HQZA";
const supabaseUrl = "https://jjyvsccqdvzmsootevuf.supabase.co";

const supabase = createClient(supabaseUrl, anonKey);


export default function mediaUpload(file) {
	return new Promise(async (resolve, reject) => {
		if (!file) {
			reject("No file selected");
			return;
		}

		try {
			const timestamp = new Date().getTime();
			const fileName = `${timestamp}_${file.name}`;

			const { error: uploadError } = await supabase.storage
				.from("images")
				.upload(fileName, file, {
					upsert: false,
					cacheControl: "3600",
				});

			if (uploadError) {
				reject(uploadError.message || "Upload failed");
				return;
			}

			const { data: publicData, error: publicError } = supabase.storage
				.from("images")
				.getPublicUrl(fileName);

			if (publicError) {
				reject(publicError.message || "Failed to get public URL");
				return;
			}

			resolve(publicData.publicUrl);
		} catch (err) {
			reject(err.message || "An error occured");
		}
	});
}
