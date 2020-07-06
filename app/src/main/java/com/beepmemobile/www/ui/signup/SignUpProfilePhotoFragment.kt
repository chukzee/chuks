package com.beepmemobile.www.ui.signup

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.Toast
import androidx.core.os.bundleOf
import androidx.drawerlayout.widget.DrawerLayout
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import com.beepmemobile.www.MainActivity

import com.beepmemobile.www.databinding.SignUpProfilePhotoFragmentBinding
import com.beepmemobile.www.data.*;
import com.beepmemobile.www.ui.main.MainViewModel
import com.beepmemobile.www.util.Constants

class SignUpProfilePhotoFragment : Fragment() {
    private val model: SignUpProfilePhotoViewModel by viewModels()
    private val authModel: MainViewModel by activityViewModels()
    private val navController by lazy { findNavController() }

    private var _binding: SignUpProfilePhotoFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding

    companion object {
        fun newInstance() = SignUpProfilePhotoFragment()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = SignUpProfilePhotoFragmentBinding.inflate(inflater, container, false)
        val view = binding?.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

        var user_id = arguments?.getString(Constants.USER_ID)?:""

        binding?.signUpProfilePhotoBtnNext?.setOnClickListener {

            var profileImag = binding?.signUpProfilePhotoImgPhoto
            var profile_photo = profileImag?.let { it1 -> imageDataToBase64(it1) }

            var status_message = binding?.signUpProfilePhotoStatusMessage?.text.toString()

            var req = mapOf<String, String>("profile_photo_base64" to (profile_photo?:""), "status_message" to status_message)

            authModel.singupStage(req, AuthState.AUTH_STAGE_PROFILE_PHOTO)
        }

        binding?.signUpProfilePhotoBtnBack?.setOnClickListener {
            //TODO go back
        }
		
		val observer = Observer<AppUser> { app_user ->
		
			if(app_user.auth_state == AuthState.AUTH_STAGE_SUCCESS){

                view.visibility = View.VISIBLE //come back
                val direction =
                            SignUpProfilePhotoFragmentDirections.moveToHomeFragment()

                val bundle = bundleOf(
                    Constants.USER_ID to user_id
                )

                navController.navigate(direction, bundle)
            }
		
		}
		
		// Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        authModel.auth.observe(viewLifecycleOwner, observer)

        super.onViewCreated(view, savedInstanceState)
    }

    private fun imageDataToBase64(img_view: ImageView): String {

        //TODO convert image data to base64 string so as to be consistent with data type
        //of other signup data and to be able to post it in JSON format

        return ""
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
